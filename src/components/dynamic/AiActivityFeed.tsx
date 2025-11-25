import type { AiActivity } from '../../types/timeline';
import { useEffect, useRef } from 'react';

interface AiActivityFeedProps {
  activities: AiActivity[];
}

function AiActivityFeed({ activities }: AiActivityFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activities]);

  const getActivityColor = (type: AiActivity['type']) => {
    switch (type) {
      case 'reasoning':
        return 'bg-purple-50 border-purple-200 text-purple-900';
      case 'action_attempt':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'action_blocked':
        return 'bg-red-50 border-red-200 text-red-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getActivityIcon = (type: AiActivity['type']) => {
    switch (type) {
      case 'reasoning':
        return '🧠';
      case 'action_attempt':
        return '⚡';
      case 'action_blocked':
        return '🚫';
      default:
        return '•';
    }
  };

  const getActivityLabel = (type: AiActivity['type']) => {
    switch (type) {
      case 'reasoning':
        return 'AI Reasoning';
      case 'action_attempt':
        return 'AI Action';
      case 'action_blocked':
        return 'Action Blocked';
      default:
        return 'Activity';
    }
  };

  return (
    <div 
      className="h-full bg-white rounded-xl shadow-md border border-gray-200 flex flex-col overflow-hidden"
      role="region"
      aria-label="AI activity feed"
    >
      <div className="px-5 py-3 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">🤖</span>
          AI Activity Feed
        </h2>
      </div>
      
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50"
        role="log"
        aria-live="polite"
        aria-atomic="false"
      >
        {activities.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <div className="text-4xl mb-2" aria-hidden="true">🤖</div>
            <p className="text-sm">No AI activity yet...</p>
            <p className="text-xs text-gray-400 mt-1">AI reasoning will appear here</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div
              key={index}
              className={`rounded-xl border-2 p-4 shadow-sm animate-fadeIn ${getActivityColor(activity.type)}`}
              role="article"
              aria-label={`${getActivityLabel(activity.type)} activity`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0" aria-hidden="true">
                  {getActivityIcon(activity.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold mb-2 uppercase tracking-wide">
                    {getActivityLabel(activity.type)}
                  </div>
                  <div className="text-sm leading-relaxed">
                    {activity.text || activity.action}
                    {activity.reason && (
                      <div className="mt-2 pt-2 border-t border-current opacity-60 text-xs">
                        <strong>Reason:</strong> {activity.reason}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AiActivityFeed;
