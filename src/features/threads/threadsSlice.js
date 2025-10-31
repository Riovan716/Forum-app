import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchThreads = createAsyncThunk(
  'threads/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const [threadsResponse, usersResponse] = await Promise.all([
        api.getAllThreads(),
        api.getAllUsers(),
      ]);

      if (threadsResponse.status === 'success' && usersResponse.status === 'success') {
        const { threads } = threadsResponse.data;
        const { users } = usersResponse.data;

        const enrichedThreads = threads.map((thread) => {
          const owner = users.find((user) => user.id === thread.ownerId);
          return {
            ...thread,
            owner: owner || null,
          };
        });

        return enrichedThreads;
      }
      return rejectWithValue('Failed to fetch data');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchThreadDetail = createAsyncThunk(
  'threads/fetchDetail',
  async (threadId, { rejectWithValue }) => {
    try {
      const response = await api.getThreadDetail(threadId);
      if (response.status === 'success') {
        return response.data.detailThread;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const createComment = createAsyncThunk(
  'threads/createComment',
  async ({ threadId, content }, { rejectWithValue }) => {
    try {
      const response = await api.createComment(threadId, content);
      if (response.status === 'success') {
        return response.data.comment;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const createThread = createAsyncThunk(
  'threads/create',
  async (threadData, { rejectWithValue }) => {
    try {
      const response = await api.createThread(threadData);
      if (response.status === 'success') {
        return response.data.thread;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  threads: [],
  threadDetail: null,
  loading: false,
  error: null,
  filteredCategory: '',
};

const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    setFilteredCategory: (state, action) => {
      state.filteredCategory = action.payload;
    },
    clearThreadDetail: (state) => {
      state.threadDetail = null;
    },
    optimisticUpVoteThread: (state, action) => {
      const { threadId, userId } = action.payload;
      const thread = state.threads.find((t) => t.id === threadId);
      if (thread) {
        if (thread.upVotesBy.includes(userId)) {
          thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
        } else {
          thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
          thread.upVotesBy.push(userId);
        }
      }
      if (state.threadDetail && state.threadDetail.id === threadId) {
        if (state.threadDetail.upVotesBy.includes(userId)) {
          state.threadDetail.upVotesBy = state.threadDetail.upVotesBy.filter((id) => id !== userId);
        } else {
          state.threadDetail.downVotesBy = state.threadDetail.downVotesBy.filter((id) => id !== userId);
          state.threadDetail.upVotesBy.push(userId);
        }
      }
    },
    optimisticDownVoteThread: (state, action) => {
      const { threadId, userId } = action.payload;
      const thread = state.threads.find((t) => t.id === threadId);
      if (thread) {
        if (thread.downVotesBy.includes(userId)) {
          thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
        } else {
          thread.upVotesBy = thread.upVotesBy?.filter((id) => id !== userId) || [];
          thread.downVotesBy.push(userId);
        }
      }
      if (state.threadDetail && state.threadDetail.id === threadId) {
        if (state.threadDetail.downVotesBy.includes(userId)) {
          state.threadDetail.downVotesBy = state.threadDetail.downVotesBy.filter((id) => id !== userId);
        } else {
          state.threadDetail.upVotesBy = state.threadDetail.upVotesBy.filter((id) => id !== userId);
          state.threadDetail.downVotesBy.push(userId);
        }
      }
    },
    optimisticUpVoteComment: (state, action) => {
      const { commentId, userId } = action.payload;
      if (state.threadDetail && state.threadDetail.comments) {
        const comment = state.threadDetail.comments.find((c) => c.id === commentId);
        if (comment) {
          if (comment.upVotesBy.includes(userId)) {
            comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
          } else {
            comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
            comment.upVotesBy.push(userId);
          }
        }
      }
    },
    optimisticDownVoteComment: (state, action) => {
      const { commentId, userId } = action.payload;
      if (state.threadDetail && state.threadDetail.comments) {
        const comment = state.threadDetail.comments.find((c) => c.id === commentId);
        if (comment) {
          if (comment.downVotesBy.includes(userId)) {
            comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
          } else {
            comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
            comment.downVotesBy.push(userId);
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.loading = false;
        state.threads = action.payload;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchThreadDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.threadDetail = action.payload;
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.threads.unshift(action.payload);
      });
  },
});

export const {
  setFilteredCategory,
  clearThreadDetail,
  optimisticUpVoteThread,
  optimisticDownVoteThread,
  optimisticUpVoteComment,
  optimisticDownVoteComment,
} = threadsSlice.actions;
export default threadsSlice.reducer;
