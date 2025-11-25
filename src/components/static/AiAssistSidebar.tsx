import { useEffect, useRef } from 'react';
import type { TranscriptLine } from '../../types/timeline';

interface AiAssistSidebarProps {
  transcripts: TranscriptLine[];
}

export default function AiAssistSidebar({ transcripts }: AiAssistSidebarProps) {
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new transcripts arrive
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  return (
    <aside 
      className="bg-white rounded-lg shadow-md p-4 border-2 border-gray-200 h-full flex flex-col hover:shadow-lg transition-shadow duration-200"
      aria-labelledby="ai-assist-heading"
    >
      <h2 id="ai-assist-heading" className="text-lg font-semibold mb-4 text-gray-800 border-b-2 border-purple-100 pb-2 flex items-center gap-2">
        <span className="text-xl" aria-hidden="true">🤖</span>
        AI Assist
      </h2>
      
      {/* Transcript Section */}
      <div className="flex-1 overflow-y-auto mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Conversation</h3>
        <div className="space-y-2">
          {transcripts.map((line, index) => (
            <div key={index} className="text-sm">
              <span className={`font-medium ${line.speaker === 'customer' ? 'text-blue-600' : 'text-purple-600'}`}>
                {line.speaker === 'customer' ? '👤 Sarah Mitchell' : '👤 Colleague (John)'}:
              </span>
              <span className="text-gray-700 ml-1">{line.text}</span>
            </div>
          ))}
          <div ref={transcriptEndRef} />
        </div>
      </div>

      {/* Sentiment Section */}
      <div className="border-t border-gray-200 pt-3 mb-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Sentiment</h3>
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
          </div>
          <span className="text-xs text-gray-600">Positive</span>
        </div>
      </div>

      {/* Suggestions Section */}
      <div className="border-t border-gray-200 pt-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Suggestions</h3>
        <div className="space-y-2">
          <div className="bg-blue-50 border border-blue-200 rounded p-2">
            <p className="text-xs text-blue-800">💡 Consider verifying customer identity</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded p-2">
            <p className="text-xs text-blue-800">💡 Review recent transaction history</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
