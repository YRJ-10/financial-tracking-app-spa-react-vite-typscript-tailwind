export interface Transaction {
  id: number;
  user_id: number;
  account_id?: number;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  notes?: string;
  tags?: string;
}

export interface Account {
  id: number;
  user_id: number;
  name: string;
  type: 'Bank' | 'E-Wallet' | 'Cash' | 'Credit Card' | 'Investment';
  balance: number;
  color?: string;
  icon?: string;
}

export interface Budget {
  id: number;
  user_id: number;
  category: string;
  amount: number;
  period: 'Weekly' | 'Monthly';
}

export interface Goal {
  id: number;
  user_id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface Bill {
  id: number;
  user_id: number;
  name: string;
  amount: number;
  due_date: string;
  category: string;
  is_paid: boolean;
  is_recurring: boolean;
  frequency?: string;
}

export interface Summary {
  total_income: number;
  total_expense: number;
}

export const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills',
  'Salary',
  'Investment',
  'Other',
  'Health',
  'Education',
  'Travel',
  'Gift'
];
