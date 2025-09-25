import { render, screen } from '@testing-library/react';
import { Badge } from '../badge';

describe('Badge', () => {
  it('should render the badge with the correct text', () => {
    render(<Badge>Test Badge</Badge>);
    const badgeElement = screen.getByText(/Test Badge/i);
    expect(badgeElement).toBeInTheDocument();
  });
});