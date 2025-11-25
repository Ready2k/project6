// Mock data for Financial Agent Desktop Demo
// This file contains simulated customer, transaction, and risk data

export interface Customer {
  id: string;
  name: string;
  accountNumber: string;
  phone: string;
  email: string;
  address: string;
  dateOfBirth: string;
  customerSince: string;
}

export interface Account {
  accountNumber: string;
  accountType: string;
  balance: number;
  status: string;
  openedDate: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: string;
  category: string;
}

export interface RiskIndicator {
  type: string;
  level: 'low' | 'medium' | 'high';
  description: string;
  detectedDate: string;
}

export interface Interaction {
  id: string;
  date: string;
  channel: string;
  summary: string;
  agent: string;
  duration: string;
}

// Mock customer data
export const mockCustomer: Customer = {
  id: 'CUST-78392',
  name: 'Sarah Mitchell',
  accountNumber: '4892-3847-2910',
  phone: '+1 (555) 234-5678',
  email: 'sarah.mitchell@email.com',
  address: '742 Maple Street, Springfield, IL 62701',
  dateOfBirth: '1985-06-15',
  customerSince: '2015-03-22'
};

// Mock account data
export const mockAccount: Account = {
  accountNumber: '4892-3847-2910',
  accountType: 'Premium Checking',
  balance: 12847.53,
  status: 'Active',
  openedDate: '2015-03-22'
};

// Mock transaction data
export const mockTransactions: Transaction[] = [
  {
    id: 'TXN-001',
    date: '2024-11-24',
    description: 'Online Purchase - TechStore',
    amount: -459.99,
    status: 'Completed',
    category: 'Shopping'
  },
  {
    id: 'TXN-002',
    date: '2024-11-23',
    description: 'ATM Withdrawal',
    amount: -200.00,
    status: 'Completed',
    category: 'Cash'
  },
  {
    id: 'TXN-003',
    date: '2024-11-22',
    description: 'Salary Deposit - Acme Corp',
    amount: 3500.00,
    status: 'Completed',
    category: 'Income'
  },
  {
    id: 'TXN-004',
    date: '2024-11-21',
    description: 'Grocery Store',
    amount: -127.43,
    status: 'Completed',
    category: 'Groceries'
  },
  {
    id: 'TXN-005',
    date: '2024-11-20',
    description: 'Electric Bill Payment',
    amount: -89.50,
    status: 'Completed',
    category: 'Utilities'
  },
  {
    id: 'TXN-006',
    date: '2024-11-19',
    description: 'Restaurant - Downtown Bistro',
    amount: -67.25,
    status: 'Completed',
    category: 'Dining'
  },
  {
    id: 'TXN-007',
    date: '2024-11-18',
    description: 'Gas Station',
    amount: -52.00,
    status: 'Completed',
    category: 'Transportation'
  },
  {
    id: 'TXN-008',
    date: '2024-11-17',
    description: 'Online Transfer to Savings',
    amount: -500.00,
    status: 'Completed',
    category: 'Transfer'
  }
];

// Mock risk indicators
export const mockRiskIndicators: RiskIndicator[] = [
  {
    type: 'Unusual Transaction Pattern',
    level: 'low',
    description: 'Recent increase in online purchases',
    detectedDate: '2024-11-24'
  },
  {
    type: 'Address Verification',
    level: 'medium',
    description: 'Address change requested - pending verification',
    detectedDate: '2024-11-25'
  }
];

// Mock previous interactions
export const mockInteractions: Interaction[] = [
  {
    id: 'INT-001',
    date: '2024-10-15',
    channel: 'Phone',
    summary: 'Inquiry about credit card rewards program',
    agent: 'John Davis',
    duration: '8 minutes'
  },
  {
    id: 'INT-002',
    date: '2024-09-03',
    channel: 'Chat',
    summary: 'Password reset assistance',
    agent: 'Emma Wilson',
    duration: '5 minutes'
  },
  {
    id: 'INT-003',
    date: '2024-07-22',
    channel: 'Phone',
    summary: 'Dispute resolution for unauthorized charge',
    agent: 'Michael Chen',
    duration: '15 minutes'
  },
  {
    id: 'INT-004',
    date: '2024-06-10',
    channel: 'Email',
    summary: 'Statement inquiry',
    agent: 'Sarah Johnson',
    duration: 'N/A'
  }
];
