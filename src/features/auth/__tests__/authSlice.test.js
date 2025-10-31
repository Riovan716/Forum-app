/**
 * @jest-environment jsdom
 */

/**
 * Test Scenarios for authSlice Reducer
 *
 * - authSlice reducer
 *   - should handle initial state correctly
 *   - should handle logout action correctly
 *   - should handle clearError action correctly
 *   - should handle registerUser.pending action
 *   - should handle registerUser.fulfilled action
 *   - should handle registerUser.rejected action
 *   - should handle loginUser.pending action
 *   - should handle loginUser.fulfilled action
 *   - should handle loginUser.rejected action
 *   - should handle getOwnProfile.pending action
 *   - should handle getOwnProfile.fulfilled action
 *   - should handle getOwnProfile.rejected action
 */

import reducer, {
  logout,
  clearError,
  registerUser,
  loginUser,
  getOwnProfile,
} from '../authSlice';

describe('authSlice reducer', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return the initial state when state is undefined', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,
    });
  });

  it('should handle logout action correctly', () => {
    const previousState = {
      user: { id: 1, name: 'Test User' },
      token: 'test-token',
      loading: false,
      error: null,
      isAuthenticated: true,
    };

    localStorage.setItem('token', 'test-token');

    expect(reducer(previousState, logout())).toEqual({
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,
    });

    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should handle clearError action correctly', () => {
    const previousState = {
      user: null,
      token: null,
      loading: false,
      error: 'Some error message',
      isAuthenticated: false,
    };

    expect(reducer(previousState, clearError())).toEqual({
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,
    });
  });

  it('should handle registerUser.pending action', () => {
    const previousState = {
      user: null,
      token: null,
      loading: false,
      error: 'Previous error',
      isAuthenticated: false,
    };

    expect(reducer(previousState, registerUser.pending())).toEqual({
      user: null,
      token: null,
      loading: true,
      error: null,
      isAuthenticated: false,
    });
  });

  it('should handle registerUser.fulfilled action', () => {
    const previousState = {
      user: null,
      token: null,
      loading: true,
      error: null,
      isAuthenticated: false,
    };

    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
    };

    expect(reducer(previousState, registerUser.fulfilled(mockUser))).toEqual({
      user: mockUser,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,
    });
  });

  it('should handle registerUser.rejected action', () => {
    const previousState = {
      user: null,
      token: null,
      loading: true,
      error: null,
      isAuthenticated: false,
    };

    const errorMessage = 'Registration failed';
    const rejectedAction = {
      type: registerUser.rejected.type,
      payload: errorMessage,
    };

    expect(reducer(previousState, rejectedAction)).toEqual({
      user: null,
      token: null,
      loading: false,
      error: errorMessage,
      isAuthenticated: false,
    });
  });

  it('should handle loginUser.pending action', () => {
    const previousState = {
      user: null,
      token: null,
      loading: false,
      error: 'Previous error',
      isAuthenticated: false,
    };

    expect(reducer(previousState, loginUser.pending())).toEqual({
      user: null,
      token: null,
      loading: true,
      error: null,
      isAuthenticated: false,
    });
  });

  it('should handle loginUser.fulfilled action', () => {
    const previousState = {
      user: null,
      token: null,
      loading: true,
      error: null,
      isAuthenticated: false,
    };

    const mockToken = 'test-token-123';

    expect(reducer(previousState, loginUser.fulfilled(mockToken))).toEqual({
      user: null,
      token: mockToken,
      loading: false,
      error: null,
      isAuthenticated: true,
    });
  });

  it('should handle loginUser.rejected action', () => {
    const previousState = {
      user: null,
      token: null,
      loading: true,
      error: null,
      isAuthenticated: false,
    };

    const errorMessage = 'Invalid credentials';
    const rejectedAction = {
      type: loginUser.rejected.type,
      payload: errorMessage,
    };

    expect(reducer(previousState, rejectedAction)).toEqual({
      user: null,
      token: null,
      loading: false,
      error: errorMessage,
      isAuthenticated: false,
    });
  });

  it('should handle getOwnProfile.pending action', () => {
    const previousState = {
      user: null,
      token: 'existing-token',
      loading: false,
      error: null,
      isAuthenticated: true,
    };

    expect(reducer(previousState, getOwnProfile.pending())).toEqual({
      user: null,
      token: 'existing-token',
      loading: true,
      error: null,
      isAuthenticated: true,
    });
  });

  it('should handle getOwnProfile.fulfilled action', () => {
    const previousState = {
      user: null,
      token: 'existing-token',
      loading: true,
      error: null,
      isAuthenticated: true,
    };

    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
    };

    expect(reducer(previousState, getOwnProfile.fulfilled(mockUser))).toEqual({
      user: mockUser,
      token: 'existing-token',
      loading: false,
      error: null,
      isAuthenticated: true,
    });
  });

  it('should handle getOwnProfile.rejected action', () => {
    const previousState = {
      user: { id: 1, name: 'Test User' },
      token: 'invalid-token',
      loading: true,
      error: null,
      isAuthenticated: true,
    };

    localStorage.setItem('token', 'invalid-token');

    expect(reducer(previousState, getOwnProfile.rejected())).toEqual({
      user: { id: 1, name: 'Test User' },
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,
    });

    expect(localStorage.getItem('token')).toBeNull();
  });
});
