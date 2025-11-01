/**
 * @jest-environment jsdom
 */

/**
 * Test Scenarios for LoginPage Component
 *
 * - LoginPage component
 *   - should render login form correctly
 *   - should display error message when login fails
 *   - should call loginUser action on form submit
 *   - should navigate to home page on successful login
 *   - should disable submit button while loading
 */

import React from 'react';
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import configureMockStore from 'redux-mock-store';
import userEvent from '@testing-library/user-event';
import LoginPage from '../LoginPage';
import authReducer from '../../features/auth/authSlice';
import api from '../../services/api';

// Mock the API service
jest.mock('../../services/api');

const mockStore = configureMockStore([]);

describe('LoginPage component', () => {
  let store;

  const renderLoginPage = (initialState) => {
    store = mockStore(initialState);
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>,
    );
  };

  beforeEach(() => {
    store = mockStore({
      auth: {
        loading: false,
        error: null,
        isAuthenticated: false,
      },
    });
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should render login form correctly', () => {
    renderLoginPage({
      auth: {
        loading: false,
        error: null,
        isAuthenticated: false,
      },
    });

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should display error message when login fails', () => {
    renderLoginPage({
      auth: {
        loading: false,
        error: 'Invalid credentials',
        isAuthenticated: false,
      },
    });

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('should call loginUser action on form submit', async () => {
    const user = userEvent.setup();

    // Setup mock API before creating store
    api.login.mockResolvedValue({
      status: 'success',
      data: { token: 'test-token' },
    });

    const realStore = configureStore({
      reducer: {
        auth: authReducer,
      },
    });

    render(
      <Provider store={realStore}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>,
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    // Fill in the form
    await user.type(emailInput, 'riovansihombing3@gmail.com');
    await user.type(passwordInput, 'riovan123'); // Use longer password to pass minLength validation

    // Get the form element and submit it
    const form = emailInput.closest('form');
    fireEvent.submit(form);

    // Wait for loading state to become true
    await waitFor(() => {
      const state = realStore.getState();
      expect(state.auth.loading).toBe(true);
    }, { timeout: 3000 });

    // Verify API was called
    expect(api.login).toHaveBeenCalledWith({
      email: 'riovansihombing3@gmail.com',
      password: 'riovan123',
    });
  });

  it('should show validation error for invalid email', async () => {
    const user = userEvent.setup();
    renderLoginPage({
      auth: {
        loading: false,
        error: null,
        isAuthenticated: false,
      },
    });

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  it('should disable submit button while loading', () => {
    renderLoginPage({
      auth: {
        loading: true,
        error: null,
        isAuthenticated: false,
      },
    });

    const submitButton = screen.getByRole('button', { name: /loading/i });
    expect(submitButton).toBeDisabled();
  });

  it('should show loading text on submit button when loading', () => {
    renderLoginPage({
      auth: {
        loading: true,
        error: null,
        isAuthenticated: false,
      },
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should intentionally fail for branch protection screenshot', () => {
    expect(true).toBe(false);
  });
});
