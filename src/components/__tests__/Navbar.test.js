/**
 * @jest-environment jsdom
 */

/**
 * Test Scenarios for Navbar Component
 *
 * - Navbar component
 *   - should render navigation links correctly for unauthenticated users
 *   - should render user info and logout button for authenticated users
 *   - should call logout action when logout button is clicked
 *   - should navigate to home page after logout
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import userEvent from '@testing-library/user-event';
import Navbar from '../Navbar';
import { logout } from '../../features/auth/authSlice';

const mockStore = configureStore([]);

describe('Navbar component', () => {
  let store;

  const renderNavbar = (initialState) => {
    store = mockStore(initialState);
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>,
    );
  };

  it('should render navigation links correctly for unauthenticated users', () => {
    const initialState = {
      auth: {
        isAuthenticated: false,
        user: null,
      },
    };

    renderNavbar(initialState);

    expect(screen.getByText('Forum Discussion')).toBeInTheDocument();
    expect(screen.getByText('Threads')).toBeInTheDocument();
    expect(screen.getByText('Leaderboards')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.queryByText(/Logout/i)).not.toBeInTheDocument();
  });

  it('should render user info and logout button for authenticated users', () => {
    const initialState = {
      auth: {
        isAuthenticated: true,
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
        },
      },
    };

    renderNavbar(initialState);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });

  it('should call logout action when logout button is clicked', async () => {
    const user = userEvent.setup();
    const initialState = {
      auth: {
        isAuthenticated: true,
        user: {
          id: 1,
          name: 'Test User',
        },
      },
    };

    renderNavbar(initialState);

    const logoutButton = screen.getByText('Logout');
    await user.click(logoutButton);

    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0].type).toBe(logout.type);
  });

  it('should display correct navigation structure', () => {
    const initialState = {
      auth: {
        isAuthenticated: false,
        user: null,
      },
    };

    renderNavbar(initialState);

    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();
    expect(navElement).toHaveClass('navbar');
  });
});
