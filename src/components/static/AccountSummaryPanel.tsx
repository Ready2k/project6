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
      className="p-4 border-b border-gray-200"
      aria-labelledby="account-summary-heading"
    >
      <h3 id="account-summary-heading" className="text-sm font-semibold text-gray-700 mb-3">Account Summary</h3>
      <div className="space-y-3 text-xs">
        <div>
          <div className="text-gray-500">Account Number</div>
          <div className="font-medium text-gray-900">{account.accountNumber}</div>
        </div>
        <div>
          <div className="text-gray-500">Account Type</div>
          <div className="font-medium text-gray-900">{account.accountType}</div>
        </div>
        <div>
          <div className="text-gray-500">Balance</div>
          <div className="text-base font-semibold text-green-600">{formatCurrency(account.balance)}</div>
        </div>
        <div>
          <div className="text-gray-500">Status</div>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {account.status}
          </span>
        </div>
      </div>
    </section>
  );
}
