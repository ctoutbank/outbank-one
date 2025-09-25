import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from '../badge';

describe('Badge Component', () => {
  it('should render the badge with the provided text', () => {
    render(<Badge>Test Badge</Badge>);
    const badgeElement = screen.getByText('Test Badge');
    expect(badgeElement).toBeInTheDocument();
  });
});
