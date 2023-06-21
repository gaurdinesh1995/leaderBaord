import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import LeaderboardScreen from '../LeaderboardScreen';

describe('LeaderboardScreen', () => {
  test('Searching for an existing user', async () => {
    const { getByPlaceholderText, getByText } = render(<LeaderboardScreen />);
    const input = getByPlaceholderText('Enter username');
    const searchButton = getByText('Search');

    // Enter the username
    fireEvent.changeText(input, 'John');

    // Trigger search
    fireEvent.press(searchButton);

    // Wait for the leaderboard to update
    await waitFor(() => {
      const userRank = getByText('1');
      expect(userRank).toBeDefined();
      expect(userRank.parent.props.children[0].props.children).toBe('John');
    });
  });

  test('Searching for a non-existing user', async () => {
    const { getByPlaceholderText, getByText } = render(<LeaderboardScreen />);
    const input = getByPlaceholderText('Enter username');
    const searchButton = getByText('Search');

    // Enter the username
    fireEvent.changeText(input, 'Alice');

    // Trigger search
    fireEvent.press(searchButton);

    // Wait for the error alert to be shown
    await waitFor(() => {
      const errorAlert = getByText('This username does not exist! Please enter an existing username.');
      expect(errorAlert).toBeDefined();
    });
  });

  test('Rendering leaderboard items', async () => {
    const leaderboardData = [
      { name: 'John', rank: 1, bananas: 100, isSearchedUser: true },
      { name: 'Alice', rank: 2, bananas: 90, isSearchedUser: false },
    ];
  
    const { getByText } = render(<LeaderboardScreen />);
  
    leaderboardData.forEach((item) => {
      const name = getByText(item.name);
      const rank = getByText(item.rank.toString());
      const bananas = getByText(item.bananas.toString());
      const isSearchedUser = getByText(item.isSearchedUser ? 'yes' : 'no');
  
      expect(name).toBeDefined();
      expect(rank).toBeDefined();
      expect(bananas).toBeDefined();
      expect(isSearchedUser).toBeDefined();
    });
  });
  
  test('Rendering empty leaderboard', async () => {
    const { queryByText } = render(<LeaderboardScreen />);
    const noItemsText = queryByText('No items to display');

    expect(noItemsText).toBeDefined();
  });

  test('Triggering search function without entering a username', async () => {
    const { getByText } = render(<LeaderboardScreen />);
    const searchButton = getByText('Search');

    // Trigger search without entering a username
    fireEvent.press(searchButton);

    // Wait for the leaderboard to remain unchanged
    await waitFor(() => {
      const userRank = getByText('1');
      expect(userRank).toBeDefined();
      expect(userRank.parent.props.children[0].props.children).not.toBe('');
    });
  });
});
