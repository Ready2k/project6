import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import StaticView from './components/static/StaticView';
import DynamicView from './components/dynamic/DynamicView';
import type { TimelineEvent } from './types/timeline';
import './App.css';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full animate-fadeIn">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Financial Agent Desktop Demo
          </h1>
          <p className="text-lg text-gray-600">
            Experience the evolution from static to dynamic agent interfaces
          </p>
        </div>
        
        <div className="space-y-4" role="navigation" aria-label="Demo selection">
          <Link
            to="/static"
            className="block w-full px-6 py-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-center font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            aria-label="View static agent desktop demonstration"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-2xl">🖱️</span>
              <span className="text-xl font-bold">Static View</span>
            </div>
            <p className="text-sm text-blue-100 font-medium">Current State - Manual Workflow</p>
            <p className="text-xs text-blue-200 mt-1">Agent clicks tabs, waits for loading, manually fills forms</p>
          </Link>
          
          <Link
            to="/dynamic"
            className="block w-full px-6 py-5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 text-center font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            aria-label="View dynamic agent desktop demonstration"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-2xl">🤖</span>
              <span className="text-xl font-bold">Dynamic View</span>
            </div>
            <p className="text-sm text-purple-100 font-medium">Future State - AI-Assisted</p>
            <p className="text-xs text-purple-200 mt-1">AI surfaces forms automatically, pre-fills data, agent confirms</p>
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Compare how AI can transform cluttered interfaces into clean, context-aware workspaces
          </p>
        </div>
      </div>
    </div>
  );
}

function ErrorDisplay({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
        <div className="text-red-600 text-5xl mb-4 text-center">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Error Loading Timeline</h2>
        <p className="text-gray-600 mb-6 text-center">{message}</p>
        <div className="flex justify-center space-x-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Retry
            </button>
          )}
          <Link
            to="/"
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function StaticViewWrapper() {
  const [timelineData, setTimelineData] = useState<TimelineEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTimeline = async () => {
    try {
      setError(null);
      const response = await import('./data/static_timeline.json');
      const data = response.default;
      
      // Validate that it's an array
      if (!Array.isArray(data)) {
        throw new Error('Timeline data must be an array');
      }
      
      setTimelineData(data as TimelineEvent[]);
    } catch (err) {
      console.error('Error loading static timeline:', err);
      setError(err instanceof Error ? err.message : 'Failed to load timeline data');
      setTimelineData([]);
    }
  };

  useEffect(() => {
    loadTimeline();
  }, []);

  if (error) {
    return <ErrorDisplay message={error} onRetry={loadTimeline} />;
  }

  if (timelineData === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading timeline...</div>
      </div>
    );
  }

  return <StaticView timelineData={timelineData} />;
}

function DynamicViewWrapper() {
  const [timelineData, setTimelineData] = useState<TimelineEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTimeline = async () => {
    try {
      setError(null);
      const response = await import('./data/dynamic_timeline.json');
      const data = response.default;
      
      // Validate that it's an array
      if (!Array.isArray(data)) {
        throw new Error('Timeline data must be an array');
      }
      
      setTimelineData(data as TimelineEvent[]);
    } catch (err) {
      console.error('Error loading dynamic timeline:', err);
      setError(err instanceof Error ? err.message : 'Failed to load timeline data');
      setTimelineData([]);
    }
  };

  useEffect(() => {
    loadTimeline();
  }, []);

  if (error) {
    return <ErrorDisplay message={error} onRetry={loadTimeline} />;
  }

  if (timelineData === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading timeline...</div>
      </div>
    );
  }

  return <DynamicView timelineData={timelineData} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/static" element={<StaticViewWrapper />} />
        <Route path="/dynamic" element={<DynamicViewWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
