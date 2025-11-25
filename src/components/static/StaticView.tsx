import { useEffect } from 'react';
import { useTimeline } from '../../hooks/useTimeline';
import CustomerProfilePanel from './CustomerProfilePanel';
import AccountSummaryPanel from './AccountSummaryPanel';
import TransactionHistoryPanel from './TransactionHistoryPanel';
import RiskFraudPanel from './RiskFraudPanel';
import PreviousInteractionsPanel from './PreviousInteractionsPanel';
import TelephonyControlsPanel from './TelephonyControlsPanel';
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
    <div className="h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-3 flex flex-col overflow-hidden" role="main">
      {/* Header */}
      <header className="mb-3 bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-600 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-3xl">📊</span>
              Agent Desktop - Current State
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Traditional interface with all panels visible simultaneously
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              STATIC MODE
            </span>
          </div>
        </div>
      </header>

      {/* Main Layout - Busy with all panels */}
      <div className="grid grid-cols-12 gap-3 flex-1 min-h-0 overflow-y-auto pb-20">
        {/* Left Column - Customer Info */}
        <aside className="col-span-3 space-y-3" aria-label="Customer information panels">
          <CustomerProfilePanel customer={safeCustomer} />
          <AccountSummaryPanel account={safeAccount} />
          <TelephonyControlsPanel />
        </aside>

        {/* Middle Column - Transaction & Risk */}
        <main className="col-span-6 space-y-3" aria-label="Transaction and risk panels">
          <TransactionHistoryPanel transactions={safeTransactions} />
          <RiskFraudPanel riskIndicators={safeRiskIndicators} />
          <PreviousInteractionsPanel interactions={safeInteractions} />
        </main>

        {/* Right Column - AI Assist */}
        <aside className="col-span-3" aria-label="AI assistance panel">
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
