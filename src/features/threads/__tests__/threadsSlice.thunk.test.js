/**
 * @jest-environment jsdom
 */

/**
 * Test Scenarios for threadsSlice Thunk Functions
 *
 * - fetchThreads thunk
 *   - should dispatch pending and fulfilled actions on successful fetch
 *   - should dispatch pending and rejected actions on failed fetch
 *   - should enrich threads with owner data
 * - fetchThreadDetail thunk
 *   - should dispatch pending and fulfilled actions on successful fetch
 *   - should dispatch pending and rejected actions on failed fetch
 */

import { configureStore } from '@reduxjs/toolkit';
import threadsReducer, { fetchThreads, fetchThreadDetail } from '../threadsSlice';
import api from '../../../services/api';

// Mock the API service
jest.mock('../../../services/api');

describe('threadsSlice thunk functions', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        threads: threadsReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe('fetchThreads', () => {
    it('should dispatch pending and fulfilled actions on successful fetch', async () => {
      const mockThreads = [
        {
          id: 'thread-1',
          title: 'Thread 1',
          ownerId: 'user-1',
        },
        {
          id: 'thread-2',
          title: 'Thread 2',
          ownerId: 'user-2',
        },
      ];

      const mockUsers = [
        {
          id: 'user-1',
          name: 'User 1',
          email: 'user1@example.com',
        },
        {
          id: 'user-2',
          name: 'User 2',
          email: 'user2@example.com',
        },
      ];

      const mockThreadsResponse = {
        status: 'success',
        data: {
          threads: mockThreads,
        },
      };

      const mockUsersResponse = {
        status: 'success',
        data: {
          users: mockUsers,
        },
      };

      api.getAllThreads.mockResolvedValue(mockThreadsResponse);
      api.getAllUsers.mockResolvedValue(mockUsersResponse);

      const result = await store.dispatch(fetchThreads());

      expect(result.type).toBe(fetchThreads.fulfilled.type);
      expect(result.payload).toHaveLength(2);
      expect(result.payload[0]).toHaveProperty('owner');
      expect(result.payload[0].owner).toEqual(mockUsers[0]);
      expect(result.payload[1].owner).toEqual(mockUsers[1]);

      const state = store.getState();
      expect(state.threads.threads).toHaveLength(2);
    });

    it('should dispatch pending and rejected actions when threads fetch fails', async () => {
      const mockThreadsResponse = {
        status: 'fail',
        message: 'Failed to fetch threads',
      };

      api.getAllThreads.mockResolvedValue(mockThreadsResponse);
      api.getAllUsers.mockResolvedValue({
        status: 'success',
        data: { users: [] },
      });

      const result = await store.dispatch(fetchThreads());

      expect(result.type).toBe(fetchThreads.rejected.type);
      expect(result.payload).toBe('Failed to fetch data');

      const state = store.getState();
      expect(state.threads.error).toBe('Failed to fetch data');
    });

    it('should handle network errors', async () => {
      const errorMessage = 'Network error';
      api.getAllThreads.mockRejectedValue(new Error(errorMessage));

      const result = await store.dispatch(fetchThreads());

      expect(result.type).toBe(fetchThreads.rejected.type);
      expect(result.payload).toBe(errorMessage);
    });

    it('should handle threads with missing owners gracefully', async () => {
      const mockThreads = [
        {
          id: 'thread-1',
          title: 'Thread 1',
          ownerId: 'user-999',
        },
      ];

      const mockUsers = [
        {
          id: 'user-1',
          name: 'User 1',
        },
      ];

      const mockThreadsResponse = {
        status: 'success',
        data: {
          threads: mockThreads,
        },
      };

      const mockUsersResponse = {
        status: 'success',
        data: {
          users: mockUsers,
        },
      };

      api.getAllThreads.mockResolvedValue(mockThreadsResponse);
      api.getAllUsers.mockResolvedValue(mockUsersResponse);

      const result = await store.dispatch(fetchThreads());

      expect(result.type).toBe(fetchThreads.fulfilled.type);
      expect(result.payload[0].owner).toBeNull();
    });
  });

  describe('fetchThreadDetail', () => {
    it('should dispatch pending and fulfilled actions on successful fetch', async () => {
      const mockThreadDetail = {
        id: 'thread-1',
        title: 'Test Thread',
        body: 'Thread body',
        comments: [],
      };

      const mockResponse = {
        status: 'success',
        data: {
          detailThread: mockThreadDetail,
        },
      };

      api.getThreadDetail.mockResolvedValue(mockResponse);

      const result = await store.dispatch(fetchThreadDetail('thread-1'));

      expect(result.type).toBe(fetchThreadDetail.fulfilled.type);
      expect(result.payload).toEqual(mockThreadDetail);
      expect(api.getThreadDetail).toHaveBeenCalledWith('thread-1');

      const state = store.getState();
      expect(state.threads.threadDetail).toEqual(mockThreadDetail);
    });

    it('should dispatch pending and rejected actions on failed fetch', async () => {
      const mockResponse = {
        status: 'fail',
        message: 'Thread not found',
      };

      api.getThreadDetail.mockResolvedValue(mockResponse);

      const result = await store.dispatch(fetchThreadDetail('invalid-thread-id'));

      expect(result.type).toBe(fetchThreadDetail.rejected.type);
      expect(result.payload).toBe('Thread not found');
    });

    it('should handle network errors', async () => {
      const errorMessage = 'Network error';
      api.getThreadDetail.mockRejectedValue(new Error(errorMessage));

      const result = await store.dispatch(fetchThreadDetail('thread-1'));

      expect(result.type).toBe(fetchThreadDetail.rejected.type);
      expect(result.payload).toBe(errorMessage);
    });
  });
});
