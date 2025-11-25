import type { Transaction } from '../../types/models';

interface TransactionHistoryPanelProps {
  transactions: Transaction[];
}

export default function TransactionHistoryPanel({ transactions }: TransactionHistoryPanelProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  return (
    <section 
      className="bg-white rounded-lg shadow-md p-4 border-2 border-gray-200 hover:shadow-lg transition-shadow duration-200"
      aria-labelledby="transaction-history-heading"
    >
      <h2 id="transaction-history-heading" className="text-lg font-semibold mb-4 text-gray-800 border-b-2 border-purple-100 pb-2 flex items-center gap-2">
        <span className="text-xl" aria-hidden="true">📊</span>
        Transaction History
      </h2>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="border-b border-gray-100 pb-2 last:border-b-0">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                <p className="text-xs text-gray-500">{transaction.date} • {transaction.id}</p>
              </div>
              <div className="text-right ml-4">
                <p className={`text-sm font-semibold ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {transaction.amount < 0 ? '-' : '+'}{formatCurrency(transaction.amount)}
                </p>
                <p className="text-xs text-gray-500">{transaction.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
