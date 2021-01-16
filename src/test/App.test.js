import { getAllByTestId, getByTestId, render, screen } from '@testing-library/react';
import App from '../components/shared/App';

test('renders title', () => {
  const { container } = render(<App />);
  const title = getByTestId(container, "title");
  expect(title.textContent).toBe("Draughts Game");
});

test('renders title', () => {
  const { container } = render(<App />);
  const numberOfLinks = getAllByTestId(container, "link")
  expect(numberOfLinks.length).toBe(3);
});