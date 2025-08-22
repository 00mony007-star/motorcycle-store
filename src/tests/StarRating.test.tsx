import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StarRating } from '../components/ui/StarRating';

describe('StarRating', () => {
  it('renders the correct number of full stars', () => {
    render(<StarRating rating={3} />);
    const fullStars = screen.getAllByRole('img', { name: /full star/i });
    expect(fullStars).toHaveLength(3);
  });

  it('renders the correct number of empty stars', () => {
    render(<StarRating rating={2} totalStars={5} />);
    const emptyStars = screen.getAllByRole('img', { name: /empty star/i });
    expect(emptyStars).toHaveLength(3);
  });

  it('handles partial stars correctly', () => {
    render(<StarRating rating={3.5} />);
    const fullStars = screen.getAllByRole('img', { name: /full star/i });
    const partialStar = screen.getByRole('img', { name: /partial star/i });
    const emptyStars = screen.getAllByRole('img', { name: /empty star/i });

    expect(fullStars).toHaveLength(3);
    expect(partialStar).toBeInTheDocument();
    expect(emptyStars).toHaveLength(1);
    expect(partialStar.querySelector('div')).toHaveStyle('width: 50%');
  });

  it('renders a rating of 0 correctly', () => {
    render(<StarRating rating={0} totalStars={5} />);
    const emptyStars = screen.getAllByRole('img', { name: /empty star/i });
    expect(emptyStars).toHaveLength(5);
  });

  it('renders a full rating correctly', () => {
    render(<StarRating rating={5} totalStars={5} />);
    const fullStars = screen.getAllByRole('img', { name: /full star/i });
    expect(fullStars).toHaveLength(5);
  });
});
