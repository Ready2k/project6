import { useEffect } from 'react';
import { useTimeline } from '../../hooks/useTimeline';
import type { TimelineEvent } from '../../types/timeline';
import Header from './Header';
import ConversationArea from './ConversationArea';
import AiActivityFeed from './AiActivityFeed';
import DynamicTileContainer from './DynamicTileContainer';
import MouseCursor from './MouseCursor';

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
    <div className="h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col" role="main">
      <Header />
      
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left side: Conversation and AI Activity - Clean and spacious */}
        <div 
          className="flex-1 flex flex-col p-6 gap-6 overflow-hidden"
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

        {/* Right side: Dynamic Tiles - Minimal and context-aware */}
        <aside 
          className="w-96 bg-white border-l border-gray-200 shadow-lg p-6 overflow-y-auto"
          role="complementary"
          aria-label="Dynamic task tiles"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-xl">💼</span>
              Active Tasks
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              AI-suggested actions appear here
            </p>
          </div>
          <DynamicTileContainer
            visiblePanels={visiblePanels}
            tileData={tileData}
            tileStatuses={tileStatuses}
            onTileSubmit={handleTileSubmit}
          />
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
    </div>
  );
}

export default DynamicView;
