import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Morocco-first conversion experience', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /understand moroccan money/i })).toBeInTheDocument();
  expect(screen.getByText(/one value\. three ways to say it/i)).toBeInTheDocument();
});
