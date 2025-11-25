import type { Customer } from '../../types/models';

interface CustomerProfilePanelProps {
  customer: Customer;
}

export default function CustomerProfilePanel({ customer }: CustomerProfilePanelProps) {
  return (
    <section 
      className="bg-white rounded-lg shadow-md p-4 border-2 border-gray-200 hover:shadow-lg transition-shadow duration-200"
      aria-labelledby="customer-profile-heading"
    >
      <h2 id="customer-profile-heading" className="text-lg font-semibold mb-4 text-gray-800 border-b-2 border-blue-100 pb-2 flex items-center gap-2">
        <span className="text-xl" aria-hidden="true">👤</span>
        Customer Profile
      </h2>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase">Customer ID</label>
          <p className="text-sm text-gray-900">{customer.id}</p>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase">Name</label>
          <p className="text-sm text-gray-900">{customer.name}</p>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase">Account Number</label>
          <p className="text-sm text-gray-900">{customer.accountNumber}</p>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase">Phone</label>
          <p className="text-sm text-gray-900">{customer.phone}</p>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
          <p className="text-sm text-gray-900">{customer.email}</p>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase">Address</label>
          <p className="text-sm text-gray-900">{customer.address}</p>
        </div>
      </div>
    </section>
  );
}
