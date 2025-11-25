// TranscriptPanel Component
// Requirements: 2.2, 4.1
// Displays conversation lines with speaker identification and timestamps

import React from 'react';
import type { TranscriptPanelProps } from '../../types/components';

export const TranscriptPanel: React.FC<TranscriptPanelProps> = ({ transcripts }) => {
  const formatTimestamp = (timestamp: number): string => {
    const seconds = Math.floor(timestamp / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="transcript-panel bg-white rounded-lg shadow p-4 h-full overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Conversation</h3>
      <div className="space-y-3">
        {transcripts.map((transcript, index) => (
          <div
            key={index}
            className={`transcript-line p-3 rounded ${
              transcript.speaker === 'customer'
                ? 'bg-blue-50 border-l-4 border-blue-500'
                : 'bg-green-50 border-l-4 border-green-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={`speaker font-semibold text-sm ${
                  transcript.speaker === 'customer' ? 'text-blue-700' : 'text-green-700'
                }`}
              >
                {transcript.speaker === 'customer' ? 'Customer' : 'Agent'}
              </span>
              <span className="timestamp text-xs text-gray-500">
                {formatTimestamp(transcript.timestamp)}
              </span>
            </div>
            <p className="text text-gray-800 text-sm">{transcript.text}</p>
          </div>
        ))}
        {transcripts.length === 0 && (
          <p className="text-gray-400 text-sm italic">No conversation yet...</p>
        )}
      </div>
    </div>
  );
};
