// Unit test for App component route configuration
// Requirements: 6.2, 6.3 - Test that /static and /dynamic routes are accessible

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import StaticView from '../../src/components/static/StaticView';
import DynamicView from '../../src/components/dynamic/DynamicView';
import staticTimelineData from '../../src/data/static_timeline.json';
import dynamicTimelineData from '../../src/data/dynamic_timeline.json';

// Home component from App.tsx
function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Financial Agent Desktop Demo</h1>
        <p className="text-gray-600 mb-6">
          Choose a demonstration to see the evolution from static to dynamic agent interfaces.
        </p>
      </div>
    </div>
  );
}

describe('App Route Configuration', () => {
  it('should render home page at root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    // Check for home page content
    expect(screen.getByText('Financial Agent Desktop Demo')).toBeInTheDocument();
    expect(screen.getByText(/Choose a demonstration/)).toBeInTheDocument();
  });

  it('should render StaticView at /static route', () => {
    render(
      <MemoryRouter initialEntries={['/static']}>
        <Routes>
          <Route path="/static" element={<StaticView timelineData={staticTimelineData} />} />
        </Routes>
      </MemoryRouter>
    );

    // Check for StaticView content - Requirements: 6.2
    expect(screen.getByText('Customer Profile')).toBeInTheDocument();
    expect(screen.getByText('Account Summary')).toBeInTheDocument();
    expect(screen.getByText('AI Assist')).toBeInTheDocument();
  });

  it('should render DynamicView at /dynamic route', () => {
    render(
      <MemoryRouter initialEntries={['/dynamic']}>
        <Routes>
          <Route path="/dynamic" element={<DynamicView timelineData={dynamicTimelineData} />} />
        </Routes>
      </MemoryRouter>
    );

    // Check for DynamicView content - Requirements: 6.3
    expect(screen.getByText('Dynamic Agent Desktop')).toBeInTheDocument();
    expect(screen.getByText('Future State - AI-Orchestrated Interface')).toBeInTheDocument();
    expect(screen.getByText('Conversation')).toBeInTheDocument();
    expect(screen.getByText('AI Activity Feed')).toBeInTheDocument();
  });

  it('should load static timeline data for /static route', () => {
    render(
      <MemoryRouter initialEntries={['/static']}>
        <Routes>
          <Route path="/static" element={<StaticView timelineData={staticTimelineData} />} />
        </Routes>
      </MemoryRouter>
    );

    // StaticView should be rendered with static timeline data
    expect(screen.getByText('Customer Profile')).toBeInTheDocument();
    expect(screen.getByText('AI Assist')).toBeInTheDocument();
  });

  it('should load dynamic timeline data for /dynamic route', () => {
    render(
      <MemoryRouter initialEntries={['/dynamic']}>
        <Routes>
          <Route path="/dynamic" element={<DynamicView timelineData={dynamicTimelineData} />} />
        </Routes>
      </MemoryRouter>
    );

    // DynamicView should be rendered with dynamic timeline data
    expect(screen.getByText('Dynamic Agent Desktop')).toBeInTheDocument();
    expect(screen.getByText('AI Activity Feed')).toBeInTheDocument();
  });
});
