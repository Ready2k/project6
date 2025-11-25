import { useEffect } from 'react';
import { useTimeline } from '../../hooks/useTimeline';
import type { TimelineEvent } from '../../types/timeline';
import ConversationArea from './ConversationArea';
import AiActivityFeed from './AiActivityFeed';
import DynamicTileContainer from './DynamicTileContainer';
import MouseCursor from './MouseCursor';
import Narration from '../shared/Narration';

interface DynamicViewProps {
  timelineData: TimelineEvent[];
}

function DynamicView({ timelineData }: DynamicViewProps) {
  const timelineState = useTimeline(timelineData);
  const {
    transcripts,
    aiActivities,
    visiblePanels,
    tileData,
    tileStatuses,
    handleTileSubmit,
  } = timelineState;

  useEffect(() => {
    // Auto-start the timeline after a brief delay
    const timer = setTimeout(() => {
      timelineState.play();
    }, 500);
    return () => clearTimeout(timer);
  }, [timelineState]);

  return (
    <div className="h-screen bg-gray-100 flex flex-col" role="main">
      {/* Top Navigation Bar - MS Dynamics style */}
      <div className="bg-[#002050] text-white px-4 py-2 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <span className="text-xl font-semibold">Agent Desktop</span>
          <span className="text-xs bg-purple-600 px-2 py-1 rounded">DYNAMIC MODE</span>
        </div>
        
        {/* Call Controls - Center */}
        <div className="flex items-center gap-2">
          <button 
            className="text-white hover:bg-blue-900 px-3 py-2 rounded text-lg transition-colors"
            title="Mute Call"
            aria-label="Mute call"
          >
            🔇
          </button>
          <button 
            className="text-white hover:bg-blue-900 px-3 py-2 rounded text-lg transition-colors"
            title="Hold Call"
            aria-label="Hold call"
          >
            ⏸️
          </button>
          <button 
            className="text-white hover:bg-red-700 bg-red-600 px-3 py-2 rounded text-lg transition-colors"
            title="End Call"
            aria-label="End call"
          >
            📞
          </button>
          <button 
            className="text-white hover:bg-blue-900 px-3 py-2 rounded text-lg transition-colors"
            title="Transfer Call"
            aria-label="Transfer call"
          >
            ↔️
          </button>
          <div className="ml-2 text-xs">
            <div className="text-gray-300">Duration: <span className="font-mono text-white">05:32</span></div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="text-white hover:bg-blue-900 px-3 py-1 rounded text-sm" title="Notifications">🔔</button>
          <button className="text-white hover:bg-blue-900 px-3 py-1 rounded text-sm" title="Settings">⚙️</button>
        </div>
      </div>

      {/* Customer Header Bar */}
      <div className="bg-white border-b border-gray-300 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            SM
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Sarah Mitchell</h2>
            <p className="text-xs text-gray-600">Customer ID: CUST-78392 • Premium Checking</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-xs text-gray-500">Sentiment</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-16 bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    timelineState.sentiment.value >= 70 ? 'bg-green-500' :
                    timelineState.sentiment.value >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${timelineState.sentiment.value}%` }}
                ></div>
              </div>
              <span className={`text-xs font-medium ${
                timelineState.sentiment.value >= 70 ? 'text-green-600' :
                timelineState.sentiment.value >= 40 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {timelineState.sentiment.label}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Sidebar - Customer Details */}
        <aside className="w-72 bg-white border-r border-gray-300 overflow-y-auto shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Customer Details</h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="text-gray-500">Account Number</div>
                <div className="font-medium text-gray-900">4892-3847-2910</div>
              </div>
              <div>
                <div className="text-gray-500">Phone</div>
                <div className="font-medium text-gray-900">+1 (555) 234-5678</div>
              </div>
              <div>
                <div className="text-gray-500">Email</div>
                <div className="font-medium text-gray-900">sarah.mitchell@email.com</div>
              </div>
              <div>
                <div className="text-gray-500">Balance</div>
                <div className="font-medium text-green-600">$12,847.53</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100">
                📋 View Full Profile
              </button>
              <button className="w-full text-left px-3 py-2 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100">
                📊 Transaction History
              </button>
              <button className="w-full text-left px-3 py-2 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100">
                🔒 Security Settings
              </button>
            </div>
          </div>
        </aside>

        {/* Center: Conversation and AI Activity */}
        <div 
          className="flex-1 flex flex-col p-4 gap-4 overflow-hidden bg-gray-50"
          role="region"
          aria-label="Conversation and AI activity area"
        >
          <div className="flex-1 min-h-0">
            <ConversationArea transcripts={transcripts} />
          </div>
          <div className="flex-1 min-h-0">
            <AiActivityFeed activities={aiActivities} />
          </div>
        </div>

        {/* Right Sidebar: Dynamic Tiles */}
        <aside 
          className="w-96 bg-white border-l border-gray-300 shadow-sm overflow-y-auto"
          role="complementary"
          aria-label="Dynamic task tiles"
        >
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-lg">🤖</span>
              AI Copilot
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Get AI-powered help with customer tasks
            </p>
          </div>
          <div className="p-4">
            <DynamicTileContainer
              visiblePanels={visiblePanels}
              tileData={tileData}
              tileStatuses={tileStatuses}
              onTileSubmit={handleTileSubmit}
            />
          </div>
        </aside>
      </div>

      {/* Timeline Controls */}
      <div 
        className="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl p-4 border border-gray-300 backdrop-blur-sm bg-opacity-95"
        role="region"
        aria-label="Timeline controls"
      >
        <div className="flex items-center space-x-3">
          <button
            onClick={() => timelineState.isPlaying ? timelineState.pause() : timelineState.play()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium transition-colors duration-200 shadow-sm"
            aria-label={timelineState.isPlaying ? 'Pause timeline' : 'Play timeline'}
          >
            {timelineState.isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            onClick={() => timelineState.reset()}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm font-medium transition-colors duration-200 shadow-sm"
            aria-label="Reset timeline"
          >
            ↻ Reset
          </button>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Timeline</span>
            <span className="text-sm font-mono font-semibold text-gray-900">
              {Math.floor(timelineState.currentTime / 1000)}s
            </span>
          </div>
        </div>
      </div>

      {/* Mouse Cursor Animation */}
      <MouseCursor
        targetElement={timelineState.mouseTarget || undefined}
        action={timelineState.mouseAction || undefined}
        visible={timelineState.mouseVisible}
      />

      {/* Narration Overlay */}
      <Narration text={timelineState.narration} />
    </div>
  );
}

export default DynamicView;
