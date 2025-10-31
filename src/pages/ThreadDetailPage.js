import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import {
  fetchThreadDetail,
  clearThreadDetail,
  createComment,
  optimisticUpVoteThread,
  optimisticDownVoteThread,
  optimisticUpVoteComment,
  optimisticDownVoteComment,
} from '../features/threads/threadsSlice';
import api from '../services/api';
import Navbar from '../components/Navbar';
import '../styles/ThreadDetailPage.css';

function ThreadDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { threadDetail, loading } = useSelector((state) => state.threads);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchThreadDetail(id));
    return () => {
      dispatch(clearThreadDetail());
    };
  }, [dispatch, id]);

  const handleVote = async (type) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const userId = user?.id;
    if (!userId) return;

    if (type === 'up') {
      dispatch(optimisticUpVoteThread({ threadId: id, userId }));
      try {
        await api.upVoteThread(id);
      } catch (error) {
        dispatch(fetchThreadDetail(id));
        console.error('Vote error:', error);
      }
    } else if (type === 'down') {
      dispatch(optimisticDownVoteThread({ threadId: id, userId }));
      try {
        await api.downVoteThread(id);
      } catch (error) {
        dispatch(fetchThreadDetail(id));
        console.error('Vote error:', error);
      }
    } else {
      try {
        await api.neutralizeVoteThread(id);
        dispatch(fetchThreadDetail(id));
      } catch (error) {
        console.error('Vote error:', error);
      }
    }
  };

  const handleCommentVote = async (commentId, type) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const userId = user?.id;
    if (!userId) return;

    if (type === 'up') {
      dispatch(optimisticUpVoteComment({ commentId, userId }));
      try {
        await api.upVoteComment(id, commentId);
      } catch (error) {
        dispatch(fetchThreadDetail(id));
        console.error('Vote error:', error);
      }
    } else if (type === 'down') {
      dispatch(optimisticDownVoteComment({ commentId, userId }));
      try {
        await api.downVoteComment(id, commentId);
      } catch (error) {
        dispatch(fetchThreadDetail(id));
        console.error('Vote error:', error);
      }
    } else {
      try {
        await api.neutralizeVoteComment(id, commentId);
        dispatch(fetchThreadDetail(id));
      } catch (error) {
        console.error('Vote error:', error);
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSubmitting(true);
    const result = await dispatch(createComment({ threadId: id, content: commentContent }));
    setSubmitting(false);
    if (!result.error) {
      setCommentContent('');
      dispatch(fetchThreadDetail(id));
    }
  };

  if (loading) {
    return (
      <div className="app">
        <Navbar />
        <div className="container">
          <div className="loading" />
        </div>
      </div>
    );
  }

  if (!threadDetail) {
    return (
      <div className="app">
        <Navbar />
        <div className="container">
          <h1>Thread not found</h1>
        </div>
      </div>
    );
  }

  const hasUpvoted = threadDetail.upVotesBy.includes(user?.id);
  const hasDownvoted = threadDetail.downVotesBy.includes(user?.id);

  return (
    <div className="app">
      <Navbar />
      <div className="container">
        <div className="thread-detail">
          <div className="thread-header">
            <h1>{threadDetail.title}</h1>
            <span className="thread-category">{threadDetail.category}</span>
          </div>

          <div className="thread-body">
            <p>{threadDetail.body}</p>
          </div>

          <div className="thread-footer">
            <div className="thread-author">
              {threadDetail.owner?.avatar && (
                <img src={threadDetail.owner.avatar} alt={threadDetail.owner.name} className="user-avatar" />
              )}
              <div>
                <p className="author-name">{threadDetail.owner?.name}</p>
                <p className="thread-date">
                  {formatDistanceToNow(new Date(threadDetail.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>

            {isAuthenticated && (
              <div className="vote-section">
                <div className="vote-count">
                  {threadDetail.upVotesBy.length - threadDetail.downVotesBy.length}
                </div>
                <div className="vote-buttons">
                  <button
                    type="button"
                    className={`vote-btn vote-btn-up ${hasUpvoted ? 'voted-up' : ''}`}
                    onClick={() => handleVote(hasUpvoted ? 'neutral' : 'up')}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className={`vote-btn vote-btn-down ${hasDownvoted ? 'voted-down' : ''}`}
                    onClick={() => handleVote(hasDownvoted ? 'neutral' : 'down')}
                  >
                    -
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {isAuthenticated && (
          <div className="create-comment-form">
            <h2>Add Comment</h2>
            <form onSubmit={handleCommentSubmit}>
              <div className="form-group">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Write your comment..."
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Comment'}
              </button>
            </form>
          </div>
        )}

        <div className="comments-section">
          <h2>
            {threadDetail.comments.length}
            {' '}
            Comments
          </h2>
          {threadDetail.comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                {comment.owner?.avatar && (
                  <img src={comment.owner.avatar} alt={comment.owner.name} className="user-avatar" />
                )}
                <div>
                  <p className="comment-author">{comment.owner?.name}</p>
                  <p className="comment-date">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <p className="comment-content">{comment.content}</p>
              {isAuthenticated && (
                <div className="vote-section">
                  <div className="vote-count">
                    {comment.upVotesBy.length - comment.downVotesBy.length}
                  </div>
                  <div className="vote-buttons">
                    <button
                      type="button"
                      className={`vote-btn vote-btn-up ${comment.upVotesBy.includes(user?.id) ? 'voted-up' : ''}`}
                      onClick={() => handleCommentVote(comment.id, comment.upVotesBy.includes(user?.id) ? 'neutral' : 'up')}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className={`vote-btn vote-btn-down ${comment.downVotesBy.includes(user?.id) ? 'voted-down' : ''}`}
                      onClick={() => handleCommentVote(comment.id, comment.downVotesBy.includes(user?.id) ? 'neutral' : 'down')}
                    >
                      -
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ThreadDetailPage;
