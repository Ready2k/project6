import type { Account } from '../../types/models';

interface AccountSummaryPanelProps {
  account: Account;
}

export default function AccountSummaryPanel({ account }: AccountSummaryPanelProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <section 
      className="bg-white rounded-lg shadow-md p-4 border-2 border-gray-200 hover:shadow-lg transition-shadow duration-200"
      aria-labelledby="account-summary-heading"
    >
      <h2 id="account-summary-heading" className="text-lg font-semibold mb-4 text-gray-800 border-b-2 border-green-100 pb-2 flex items-center gap-2">
        <span className="text-xl" aria-hidden="true">💳</span>
        Account Summary
      </h2>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase">Account Number</label>
          <p className="text-sm text-gray-900">{account.accountNumber}</p>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase">Account Type</label>
          <p className="text-sm text-gray-900">{account.accountType}</p>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase">Balance</label>
          <p className="text-lg font-semibold text-green-600">{formatCurrency(account.balance)}</p>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase">Status</label>
          <p className="text-sm">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {account.status}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
