import { useEffect } from 'react';
import { useTimeline } from '../../hooks/useTimeline';
import CustomerProfilePanel from './CustomerProfilePanel';
import AccountSummaryPanel from './AccountSummaryPanel';
import TransactionHistoryPanel from './TransactionHistoryPanel';
import RiskFraudPanel from './RiskFraudPanel';
import PreviousInteractionsPanel from './PreviousInteractionsPanel';
import AiAssistSidebar from './AiAssistSidebar';
import {
  mockCustomer,
  mockAccount,
  mockTransactions,
  mockRiskIndicators,
  mockInteractions,
  type Customer,
  type Account,
  type Transaction,
  type RiskIndicator,
  type Interaction
} from '../../data/mock_data';
import type { TimelineEvent } from '../../types/timeline';

interface StaticViewProps {
  timelineData: TimelineEvent[];
}

// Provide fallback data in case mock data is missing or invalid
const safeCustomer: Customer = mockCustomer || {
  id: 'N/A',
  name: 'Unknown Customer',
  accountNumber: 'N/A',
  phone: 'N/A',
  email: 'N/A',
  address: 'N/A',
  dateOfBirth: 'N/A',
  customerSince: 'N/A'
};

const safeAccount: Account = mockAccount || {
  accountNumber: 'N/A',
  accountType: 'N/A',
  balance: 0,
  status: 'N/A',
  openedDate: 'N/A'
};

const safeTransactions: Transaction[] = Array.isArray(mockTransactions) ? mockTransactions : [];
const safeRiskIndicators: RiskIndicator[] = Array.isArray(mockRiskIndicators) ? mockRiskIndicators : [];
const safeInteractions: Interaction[] = Array.isArray(mockInteractions) ? mockInteractions : [];

export default function StaticView({ timelineData }: StaticViewProps) {
  const timelineState = useTimeline(timelineData);

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
          <span className="text-xs bg-blue-600 px-2 py-1 rounded">STATIC MODE</span>
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
            <h2 className="text-lg font-semibold text-gray-900">{safeCustomer.name}</h2>
            <p className="text-xs text-gray-600">Customer ID: {safeCustomer.id} • {safeAccount.accountType}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-xs text-gray-500">Sentiment</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-16 bg-gray-200 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <span className="text-xs font-medium text-green-600">Positive</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout - All panels visible */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Sidebar - Customer Details */}
        <aside className="w-72 bg-white border-r border-gray-300 overflow-y-auto shadow-sm">
          <CustomerProfilePanel customer={safeCustomer} />
          <AccountSummaryPanel account={safeAccount} />
        </aside>

        {/* Center: Transaction & Risk Panels */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
          <TransactionHistoryPanel transactions={safeTransactions} />
          <RiskFraudPanel riskIndicators={safeRiskIndicators} />
          <PreviousInteractionsPanel interactions={safeInteractions} />
        </div>

        {/* Right Sidebar: AI Assist */}
        <aside className="w-80 bg-white border-l border-gray-300 shadow-sm overflow-y-auto">
          <AiAssistSidebar transcripts={timelineState.transcripts} />
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
    </div>
  );
}
