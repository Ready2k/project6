// Mock Data Model Interfaces

export interface Customer {
  id: string;
  name: string;
  accountNumber: string;
  phone: string;
  email: string;
  address: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: string;
}

export interface RiskIndicator {
  type: string;
  level: 'low' | 'medium' | 'high';
  description: string;
}

export interface Interaction {
  id: string;
  date: string;
  channel: string;
  summary: string;
  agent: string;
  duration: string;
}

export interface Account {
  accountNumber: string;
  accountType: string;
  balance: number;
  status: string;
}
