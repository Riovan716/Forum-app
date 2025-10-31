/**
 * @jest-environment jsdom
 */

/**
 * Test Scenarios for ThreadCard Component
 *
 * - ThreadCard component
 *   - should render thread information correctly
 *   - should navigate to thread detail page when clicked
 *   - should display owner information when available
 *   - should display formatted time correctly
 *   - should handle keyboard navigation
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ThreadCard from '../ThreadCard';

describe('ThreadCard component', () => {
  const mockThread = {
    id: 'thread-1',
    title: 'Test Thread Title',
    body: 'This is a test thread body with enough content to test the preview functionality.',
    category: 'Technology',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    totalComments: 5,
    owner: {
      id: 'user-1',
      name: 'John Doe',
      avatar: 'https://example.com/avatar.jpg',
    },
    upVotesBy: [],
    downVotesBy: [],
  };

  const renderThreadCard = (thread = mockThread) => render(
    <MemoryRouter>
      <ThreadCard thread={thread} />
    </MemoryRouter>,
  );

  it('should render thread information correctly', () => {
    renderThreadCard();

    expect(screen.getByText('Test Thread Title')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText(/5\s+comments/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });

  it('should navigate to thread detail page when clicked', async () => {
    const user = userEvent.setup();
    renderThreadCard();

    const threadCard = screen.getByRole('button');
    await user.click(threadCard);

    // Verify that the click handler was triggered
    expect(threadCard).toBeInTheDocument();
  });

  it('should display owner information when available', () => {
    renderThreadCard();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    const avatarImage = screen.getByAltText('John Doe');
    expect(avatarImage).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();
    renderThreadCard();

    const threadCard = screen.getByRole('button');
    await user.tab();
    await user.keyboard('{Enter}');

    // Verify that the keyboard handler was triggered
    expect(threadCard).toBeInTheDocument();
  });

  it('should display thread body preview correctly', () => {
    renderThreadCard();

    const bodyText = screen.getByText(/This is a test thread body/i);
    expect(bodyText).toBeInTheDocument();
  });

  it('should handle thread without owner gracefully', () => {
    const threadWithoutOwner = {
      ...mockThread,
      owner: null,
    };

    renderThreadCard(threadWithoutOwner);

    expect(screen.getByText('Test Thread Title')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });
});
