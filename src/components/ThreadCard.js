import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import '../styles/ThreadCard.css';

function ThreadCard({ thread }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/threads/${thread.id}`);
  };

  return (
    <div className="thread-card" onClick={handleClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleClick()}>
      <div className="thread-header">
        <h3 className="thread-title">{thread.title}</h3>
        <span className="thread-category">{thread.category}</span>
      </div>
      <p className="thread-body-preview">
        {thread.body.substring(0, 150)}
        ...
      </p>
      <div className="thread-footer">
        <div className="thread-meta">
          <span className="thread-meta-comments">
            {thread.totalComments}
            {' '}
            comments
          </span>
          <span className="thread-meta-time">
            {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
          </span>
        </div>
        {thread.owner && (
          <div className="thread-author-info">
            {thread.owner.avatar && (
              <img src={thread.owner.avatar} alt={thread.owner.name} className="user-avatar-small" />
            )}
            <span className="thread-author-name">{thread.owner.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ThreadCard;
