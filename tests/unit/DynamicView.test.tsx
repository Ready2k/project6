// Unit test for dynamic view initial rendering
// Requirements: 3.1 - Test that minimal interface elements are present on load

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DynamicView from '../../src/components/dynamic/DynamicView';

describe('DynamicView Initial Rendering', () => {
  it('should render minimal interface elements on load', () => {
    // Empty timeline to test initial state
    const emptyTimeline: any[] = [];

    render(
      <BrowserRouter>
        <DynamicView timelineData={emptyTimeline} />
      </BrowserRouter>
    );

    // Check for Header
    expect(screen.getByText('Dynamic Agent Desktop')).toBeInTheDocument();
    expect(screen.getByText('Future State - AI-Orchestrated Interface')).toBeInTheDocument();

    // Check for Conversation Area
    expect(screen.getByText('Conversation')).toBeInTheDocument();
    expect(screen.getByText('No conversation yet...')).toBeInTheDocument();

    // Check for AI Activity Feed
    expect(screen.getByText('AI Activity Feed')).toBeInTheDocument();
    expect(screen.getByText('No AI activity yet...')).toBeInTheDocument();

    // Check for Dynamic Tile Container (empty state)
    expect(screen.getByText('No active tasks')).toBeInTheDocument();
    expect(screen.getByText('Tiles will appear here as the AI identifies relevant actions')).toBeInTheDocument();

    // Check for Back to Home link (with arrow prefix)
    expect(screen.getByText(/Back to Home/)).toBeInTheDocument();
  });

  it('should have proper layout structure', () => {
    const emptyTimeline: any[] = [];

    const { container } = render(
      <BrowserRouter>
        <DynamicView timelineData={emptyTimeline} />
      </BrowserRouter>
    );

    // Check that the main container exists
    const mainContainer = container.querySelector('.min-h-screen');
    expect(mainContainer).toBeInTheDocument();

    // Check that conversation and AI activity areas exist
    expect(screen.getByText('Conversation')).toBeInTheDocument();
    expect(screen.getByText('AI Activity Feed')).toBeInTheDocument();
  });
});
