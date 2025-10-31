/**
 * @jest-environment jsdom
 */

/**
 * Test Scenarios for authSlice Thunk Functions
 *
 * - loginUser thunk
 *   - should dispatch pending and fulfilled actions on successful login
 *   - should dispatch pending and rejected actions on failed login
 *   - should save token to localStorage on successful login
 * - getOwnProfile thunk
 *   - should dispatch pending and fulfilled actions on successful fetch
 *   - should dispatch pending and rejected actions on failed fetch
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loginUser, getOwnProfile } from '../authSlice';
import api from '../../../services/api';

// Mock the API service
jest.mock('../../../services/api');

describe('authSlice thunk functions', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('should dispatch pending and fulfilled actions on successful login', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          token: 'test-token-123',
        },
      };

      api.login.mockResolvedValue(mockResponse);

      const result = await store.dispatch(loginUser({ email: 'test@example.com', password: 'password123' }));

      expect(result.type).toBe(loginUser.fulfilled.type);
      expect(result.payload).toBe('test-token-123');
      expect(localStorage.getItem('token')).toBe('test-token-123');
      expect(api.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
      
      const state = store.getState();
      expect(state.auth.token).toBe('test-token-123');
      expect(state.auth.isAuthenticated).toBe(true);
    });

    it('should dispatch pending and rejected actions on failed login', async () => {
      const mockResponse = {
        status: 'fail',
        message: 'Invalid credentials',
      };

      api.login.mockResolvedValue(mockResponse);

      const result = await store.dispatch(loginUser({ email: 'test@example.com', password: 'wrongpassword' }));

      expect(result.type).toBe(loginUser.rejected.type);
      expect(result.payload).toBe('Invalid credentials');
      expect(localStorage.getItem('token')).toBeNull();
      
      const state = store.getState();
      expect(state.auth.error).toBe('Invalid credentials');
      expect(state.auth.isAuthenticated).toBe(false);
    });

    it('should handle network errors', async () => {
      const errorMessage = 'Network error';
      api.login.mockRejectedValue(new Error(errorMessage));

      const result = await store.dispatch(loginUser({ email: 'test@example.com', password: 'password123' }));

      expect(result.type).toBe(loginUser.rejected.type);
      expect(result.payload).toBe(errorMessage);
    });
  });

  describe('getOwnProfile', () => {
    it('should dispatch pending and fulfilled actions on successful fetch', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      };

      const mockResponse = {
        status: 'success',
        data: {
          user: mockUser,
        },
      };

      api.getOwnProfile.mockResolvedValue(mockResponse);
      localStorage.setItem('token', 'test-token');

      const result = await store.dispatch(getOwnProfile());

      expect(result.type).toBe(getOwnProfile.fulfilled.type);
      expect(result.payload).toEqual(mockUser);
      expect(api.getOwnProfile).toHaveBeenCalled();
      
      const state = store.getState();
      expect(state.auth.user).toEqual(mockUser);
    });

    it('should dispatch pending and rejected actions on failed fetch', async () => {
      const mockResponse = {
        status: 'fail',
        message: 'Unauthorized',
      };

      api.getOwnProfile.mockResolvedValue(mockResponse);

      const result = await store.dispatch(getOwnProfile());

      expect(result.type).toBe(getOwnProfile.rejected.type);
      expect(result.payload).toBe('Unauthorized');
    });

    it('should handle network errors', async () => {
      const errorMessage = 'Network error';
      api.getOwnProfile.mockRejectedValue(new Error(errorMessage));

      const result = await store.dispatch(getOwnProfile());

      expect(result.type).toBe(getOwnProfile.rejected.type);
      expect(result.payload).toBe(errorMessage);
    });
  });
});

