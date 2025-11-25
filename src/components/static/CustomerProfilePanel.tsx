import type { Customer } from '../../types/models';

interface CustomerProfilePanelProps {
  customer: Customer;
}

export default function CustomerProfilePanel({ customer }: CustomerProfilePanelProps) {
  return (
    <section 
      className="p-4 border-b border-gray-200"
      aria-labelledby="customer-profile-heading"
    >
      <h3 id="customer-profile-heading" className="text-sm font-semibold text-gray-700 mb-3">Customer Details</h3>
      <div className="space-y-3 text-xs">
        <div>
          <div className="text-gray-500">Customer ID</div>
          <div className="font-medium text-gray-900">{customer.id}</div>
        </div>
        <div>
          <div className="text-gray-500">Name</div>
          <div className="font-medium text-gray-900">{customer.name}</div>
        </div>
        <div>
          <div className="text-gray-500">Account Number</div>
          <div className="font-medium text-gray-900">{customer.accountNumber}</div>
        </div>
        <div>
          <div className="text-gray-500">Phone</div>
          <div className="font-medium text-gray-900">{customer.phone}</div>
        </div>
        <div>
          <div className="text-gray-500">Email</div>
          <div className="font-medium text-gray-900">{customer.email}</div>
        </div>
        <div>
          <div className="text-gray-500">Address</div>
          <div className="font-medium text-gray-900">{customer.address}</div>
        </div>
      </div>
    </section>
  );
}
