import { useState, useEffect } from 'react';
import type { TileProps } from '../../types';

export default function DisputeTransactionTile({ data, onSubmit, status = 'idle' }: TileProps) {
  const [transactionId, setTransactionId] = useState('');
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const [autoPopulatedFields, setAutoPopulatedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (data && typeof data === 'object') {
      try {
        const populated = new Set<string>();
        
        if (data.transactionId !== undefined && data.transactionId !== null) {
          setTransactionId(String(data.transactionId));
          populated.add('transactionId');
        }
        if (data.reason !== undefined && data.reason !== null) {
          setReason(String(data.reason));
          populated.add('reason');
        }
        if (data.amount !== undefined && data.amount !== null) {
          setAmount(String(data.amount));
          populated.add('amount');
        }
        
        setAutoPopulatedFields(populated);
      } catch (error) {
        console.error('Error auto-populating DisputeTransactionTile:', error);
      }
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ transactionId, reason, amount: parseFloat(amount) || 0 });
  };

  const getFieldClassName = (fieldName: string) => {
    const baseClass = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200';
    return autoPopulatedFields.has(fieldName)
      ? `${baseClass} bg-blue-50 border-blue-400 border-2 shadow-sm`
      : `${baseClass} border-gray-300`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl" aria-hidden="true">⚠️</span>
        <h3 className="text-xl font-bold text-gray-900">Dispute Transaction</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-1">
            Transaction ID
            {autoPopulatedFields.has('transactionId') && (
              <span className="ml-2 text-xs text-blue-600 font-semibold" aria-label="AI suggested">✨ AI Suggested</span>
            )}
          </label>
          <input
            id="transactionId"
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className={getFieldClassName('transactionId')}
            data-auto-populated={autoPopulatedFields.has('transactionId')}
            disabled={status === 'submitting' || status === 'completed'}
            placeholder="TXN-123456"
            aria-describedby={autoPopulatedFields.has('transactionId') ? 'transactionId-ai-hint' : undefined}
          />
          {autoPopulatedFields.has('transactionId') && (
            <p id="transactionId-ai-hint" className="sr-only">This field was auto-populated by AI</p>
          )}
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
            Dispute Reason
            {autoPopulatedFields.has('reason') && (
              <span className="ml-2 text-xs text-blue-600 font-semibold" aria-label="AI suggested">✨ AI Suggested</span>
            )}
          </label>
          <select
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={getFieldClassName('reason')}
            data-auto-populated={autoPopulatedFields.has('reason')}
            disabled={status === 'submitting' || status === 'completed'}
            aria-describedby={autoPopulatedFields.has('reason') ? 'reason-ai-hint' : undefined}
          >
            <option value="">Select Reason</option>
            <option value="unauthorized">Unauthorized Transaction</option>
            <option value="duplicate">Duplicate Charge</option>
            <option value="incorrect_amount">Incorrect Amount</option>
            <option value="not_received">Product/Service Not Received</option>
            <option value="defective">Defective Product/Service</option>
            <option value="cancelled">Cancelled Transaction</option>
            <option value="other">Other</option>
          </select>
          {autoPopulatedFields.has('reason') && (
            <p id="reason-ai-hint" className="sr-only">This field was auto-populated by AI</p>
          )}
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Disputed Amount ($)
            {autoPopulatedFields.has('amount') && (
              <span className="ml-2 text-xs text-blue-600 font-semibold" aria-label="AI suggested">✨ AI Suggested</span>
            )}
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={getFieldClassName('amount')}
            data-auto-populated={autoPopulatedFields.has('amount')}
            disabled={status === 'submitting' || status === 'completed'}
            placeholder="0.00"
            aria-describedby={autoPopulatedFields.has('amount') ? 'amount-ai-hint' : undefined}
          />
          {autoPopulatedFields.has('amount') && (
            <p id="amount-ai-hint" className="sr-only">This field was auto-populated by AI</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
          <button
            type="submit"
            disabled={status === 'submitting' || status === 'completed'}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md ${
              status === 'completed'
                ? 'bg-green-500 text-white cursor-not-allowed'
                : status === 'submitting'
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
            aria-label={status === 'completed' ? 'Form submitted' : status === 'submitting' ? 'Submitting form' : 'Submit form'}
          >
            {status === 'completed' ? '✓ Submitted' : status === 'submitting' ? '⏳ Submitting...' : 'Submit'}
          </button>

          {status === 'completed' && (
            <span className="text-green-600 font-semibold flex items-center gap-1 animate-fadeIn" role="status">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Completed
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
