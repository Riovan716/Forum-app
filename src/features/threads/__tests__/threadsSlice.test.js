/**
 * @jest-environment jsdom
 */

/**
 * Test Scenarios for threadsSlice Reducer
 *
 * - threadsSlice reducer
 *   - should handle initial state correctly
 *   - should handle setFilteredCategory action correctly
 *   - should handle clearThreadDetail action correctly
 *   - should handle optimisticUpVoteThread action (add vote)
 *   - should handle optimisticUpVoteThread action (remove vote)
 *   - should handle optimisticDownVoteThread action (add vote)
 *   - should handle optimisticDownVoteThread action (remove vote)
 *   - should handle optimisticUpVoteComment action
 *   - should handle optimisticDownVoteComment action
 *   - should handle fetchThreads.pending action
 *   - should handle fetchThreads.fulfilled action
 *   - should handle fetchThreads.rejected action
 *   - should handle fetchThreadDetail.pending action
 *   - should handle fetchThreadDetail.fulfilled action
 *   - should handle fetchThreadDetail.rejected action
 *   - should handle createThread.fulfilled action
 */

import reducer, {
  setFilteredCategory,
  clearThreadDetail,
  optimisticUpVoteThread,
  optimisticDownVoteThread,
  optimisticUpVoteComment,
  optimisticDownVoteComment,
} from '../threadsSlice';
import { fetchThreads, fetchThreadDetail, createThread } from '../threadsSlice';

describe('threadsSlice reducer', () => {
  const initialState = {
    threads: [],
    threadDetail: null,
    loading: false,
    error: null,
    filteredCategory: '',
  };

  it('should return the initial state when state is undefined', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setFilteredCategory action correctly', () => {
    const previousState = initialState;
    const category = 'Technology';

    expect(reducer(previousState, setFilteredCategory(category))).toEqual({
      ...initialState,
      filteredCategory: category,
    });
  });

  it('should handle clearThreadDetail action correctly', () => {
    const previousState = {
      ...initialState,
      threadDetail: { id: 'thread-1', title: 'Test Thread' },
    };

    expect(reducer(previousState, clearThreadDetail())).toEqual({
      ...previousState,
      threadDetail: null,
    });
  });

  it('should handle optimisticUpVoteThread action - add vote', () => {
    const previousState = {
      ...initialState,
      threads: [
        {
          id: 'thread-1',
          title: 'Test Thread',
          upVotesBy: [],
          downVotesBy: [],
        },
      ],
    };

    const action = optimisticUpVoteThread({ threadId: 'thread-1', userId: 'user-1' });

    const newState = reducer(previousState, action);

    expect(newState.threads[0].upVotesBy).toContain('user-1');
    expect(newState.threads[0].downVotesBy).not.toContain('user-1');
  });

  it('should handle optimisticUpVoteThread action - remove vote when already voted', () => {
    const previousState = {
      ...initialState,
      threads: [
        {
          id: 'thread-1',
          title: 'Test Thread',
          upVotesBy: ['user-1'],
          downVotesBy: [],
        },
      ],
    };

    const action = optimisticUpVoteThread({ threadId: 'thread-1', userId: 'user-1' });

    const newState = reducer(previousState, action);

    expect(newState.threads[0].upVotesBy).not.toContain('user-1');
  });

  it('should handle optimisticDownVoteThread action - add vote', () => {
    const previousState = {
      ...initialState,
      threads: [
        {
          id: 'thread-1',
          title: 'Test Thread',
          upVotesBy: [],
          downVotesBy: [],
        },
      ],
    };

    const action = optimisticDownVoteThread({ threadId: 'thread-1', userId: 'user-1' });

    const newState = reducer(previousState, action);

    expect(newState.threads[0].downVotesBy).toContain('user-1');
    expect(newState.threads[0].upVotesBy).not.toContain('user-1');
  });

  it('should handle optimisticDownVoteThread action - remove vote when already voted', () => {
    const previousState = {
      ...initialState,
      threads: [
        {
          id: 'thread-1',
          title: 'Test Thread',
          upVotesBy: [],
          downVotesBy: ['user-1'],
        },
      ],
    };

    const action = optimisticDownVoteThread({ threadId: 'thread-1', userId: 'user-1' });

    const newState = reducer(previousState, action);

    expect(newState.threads[0].downVotesBy).not.toContain('user-1');
  });

  it('should handle optimisticUpVoteComment action', () => {
    const previousState = {
      ...initialState,
      threadDetail: {
        id: 'thread-1',
        title: 'Test Thread',
        comments: [
          {
            id: 'comment-1',
            content: 'Test comment',
            upVotesBy: [],
            downVotesBy: [],
          },
        ],
      },
    };

    const action = optimisticUpVoteComment({ commentId: 'comment-1', userId: 'user-1' });

    const newState = reducer(previousState, action);

    expect(newState.threadDetail.comments[0].upVotesBy).toContain('user-1');
    expect(newState.threadDetail.comments[0].downVotesBy).not.toContain('user-1');
  });

  it('should handle optimisticDownVoteComment action', () => {
    const previousState = {
      ...initialState,
      threadDetail: {
        id: 'thread-1',
        title: 'Test Thread',
        comments: [
          {
            id: 'comment-1',
            content: 'Test comment',
            upVotesBy: [],
            downVotesBy: [],
          },
        ],
      },
    };

    const action = optimisticDownVoteComment({ commentId: 'comment-1', userId: 'user-1' });

    const newState = reducer(previousState, action);

    expect(newState.threadDetail.comments[0].downVotesBy).toContain('user-1');
    expect(newState.threadDetail.comments[0].upVotesBy).not.toContain('user-1');
  });

  it('should handle fetchThreads.pending action', () => {
    const previousState = {
      ...initialState,
      error: 'Previous error',
    };

    expect(reducer(previousState, fetchThreads.pending())).toEqual({
      ...previousState,
      loading: true,
      error: null,
    });
  });

  it('should handle fetchThreads.fulfilled action', () => {
    const previousState = {
      ...initialState,
      loading: true,
      threads: [],
    };

    const mockThreads = [
      { id: 'thread-1', title: 'Thread 1' },
      { id: 'thread-2', title: 'Thread 2' },
    ];

    expect(reducer(previousState, fetchThreads.fulfilled(mockThreads))).toEqual({
      ...previousState,
      loading: false,
      threads: mockThreads,
    });
  });

  it('should handle fetchThreads.rejected action', () => {
    const previousState = {
      ...initialState,
      loading: true,
      error: null,
    };

    const errorMessage = 'Failed to fetch threads';
    const rejectedAction = {
      type: fetchThreads.rejected.type,
      payload: errorMessage,
    };

    expect(reducer(previousState, rejectedAction)).toEqual({
      ...previousState,
      loading: false,
      error: errorMessage,
    });
  });

  it('should handle fetchThreadDetail.pending action', () => {
    const previousState = {
      ...initialState,
      error: 'Previous error',
    };

    expect(reducer(previousState, fetchThreadDetail.pending())).toEqual({
      ...previousState,
      loading: true,
      error: null,
    });
  });

  it('should handle fetchThreadDetail.fulfilled action', () => {
    const previousState = {
      ...initialState,
      loading: true,
      threadDetail: null,
    };

    const mockThreadDetail = {
      id: 'thread-1',
      title: 'Test Thread',
      body: 'Thread body',
      comments: [],
    };

    expect(reducer(previousState, fetchThreadDetail.fulfilled(mockThreadDetail))).toEqual({
      ...previousState,
      loading: false,
      threadDetail: mockThreadDetail,
    });
  });

  it('should handle fetchThreadDetail.rejected action', () => {
    const previousState = {
      ...initialState,
      loading: true,
      error: null,
    };

    const errorMessage = 'Failed to fetch thread detail';
    const rejectedAction = {
      type: fetchThreadDetail.rejected.type,
      payload: errorMessage,
    };

    expect(reducer(previousState, rejectedAction)).toEqual({
      ...previousState,
      loading: false,
      error: errorMessage,
    });
  });

  it('should handle createThread.fulfilled action', () => {
    const previousState = {
      ...initialState,
      threads: [{ id: 'thread-1', title: 'Existing Thread' }],
    };

    const newThread = {
      id: 'thread-2',
      title: 'New Thread',
    };

    const newState = reducer(previousState, createThread.fulfilled(newThread));

    expect(newState.threads).toHaveLength(2);
    expect(newState.threads[0]).toEqual(newThread);
  });
});

