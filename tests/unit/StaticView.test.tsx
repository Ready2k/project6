import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StaticView from '../../src/components/static/StaticView';

describe('StaticView Panel Rendering', () => {
  it('should render all required panels when StaticView renders', () => {
    // Arrange
    const mockTimelineData = [];

    // Act
    render(<StaticView timelineData={mockTimelineData} />);

    // Assert - Check that all required panels are present
    // Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7
    expect(screen.getByText('Customer Profile')).toBeInTheDocument();
    expect(screen.getByText('Account Summary')).toBeInTheDocument();
    expect(screen.getByText('Transaction History')).toBeInTheDocument();
    expect(screen.getByText('Risk & Fraud Indicators')).toBeInTheDocument();
    expect(screen.getByText('Previous Interactions')).toBeInTheDocument();
    expect(screen.getByText('Telephony Controls')).toBeInTheDocument();
    expect(screen.getByText('AI Assist')).toBeInTheDocument();
  });
});
