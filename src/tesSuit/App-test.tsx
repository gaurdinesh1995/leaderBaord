import React from 'react';
import renderer from 'react-test-renderer';
import LeaderboardScreen from '../LeaderboardScreen';

it('renders correctly', () => {
  renderer.create(<LeaderboardScreen />);
});