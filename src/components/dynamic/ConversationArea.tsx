import type { TranscriptLine } from '../../types/timeline';
import { useEffect, useRef } from 'react';

interface ConversationAreaProps {
  transcripts: TranscriptLine[];
}

function ConversationArea({ transcripts }: ConversationAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts]);

  return (
    <div 
      className="h-full bg-white rounded-xl shadow-md border border-gray-200 flex flex-col overflow-hidden"
      role="region"
      aria-label="Conversation transcript"
    >
      <div className="px-5 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">💬</span>
          Conversation
        </h2>
      </div>
      
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50"
        role="log"
        aria-live="polite"
        aria-atomic="false"
      >
        {transcripts.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <div className="text-4xl mb-2" aria-hidden="true">💬</div>
            <p className="text-sm">No conversation yet...</p>
            <p className="text-xs text-gray-400 mt-1">Messages will appear here</p>
          </div>
        ) : (
          transcripts.map((transcript, index) => (
            <div
              key={index}
              className={`flex animate-fadeIn ${
                transcript.speaker === 'agent' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[75%] rounded-xl px-4 py-3 shadow-sm ${
                  transcript.speaker === 'agent'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
                role="article"
                aria-label={`${transcript.speaker === 'agent' ? 'Agent' : 'Customer'} message`}
              >
                <div className={`text-xs font-semibold mb-1 ${
                  transcript.speaker === 'agent' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {transcript.speaker === 'agent' ? '🤖 Agent (Human)' : '👤 Customer'}
                </div>
                <div className="text-sm leading-relaxed">{transcript.text}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ConversationArea;
