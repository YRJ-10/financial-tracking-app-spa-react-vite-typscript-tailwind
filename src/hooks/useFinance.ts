import { useState, useEffect, useCallback } from 'react';
import { Transaction, Summary, Account, Budget, Goal, Bill } from '../types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'fintrack_transactions',
  ACCOUNTS: 'fintrack_accounts',
  BUDGETS: 'fintrack_budgets',
  GOALS: 'fintrack_goals',
  BILLS: 'fintrack_bills'
};

export function useFinance(userId?: number) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [summary, setSummary] = useState<Summary>({ total_income: 0, total_expense: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    if (!userId) return;

    const storedTransactions = JSON.parse(localStorage.getItem(`${STORAGE_KEYS.TRANSACTIONS}_${userId}`) || '[]');
    const storedAccounts = JSON.parse(localStorage.getItem(`${STORAGE_KEYS.ACCOUNTS}_${userId}`) || '[]');
    const storedBudgets = JSON.parse(localStorage.getItem(`${STORAGE_KEYS.BUDGETS}_${userId}`) || '[]');
    const storedGoals = JSON.parse(localStorage.getItem(`${STORAGE_KEYS.GOALS}_${userId}`) || '[]');
    const storedBills = JSON.parse(localStorage.getItem(`${STORAGE_KEYS.BILLS}_${userId}`) || '[]');

    setTransactions(storedTransactions);
    setAccounts(storedAccounts);
    setBudgets(storedBudgets);
    setGoals(storedGoals);
    setBills(storedBills);

    const income = storedTransactions
      .filter((t: Transaction) => t.type === 'income')
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
    const expense = storedTransactions
      .filter((t: Transaction) => t.type === 'expense')
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

    setSummary({ total_income: income, total_expense: expense });
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id'>) => {
    if (!userId) return;
    const newId = Date.now();
    const newTrans: Transaction = { ...transaction, id: newId, user_id: userId };
    const updated = [newTrans, ...transactions];
    
    localStorage.setItem(`${STORAGE_KEYS.TRANSACTIONS}_${userId}`, JSON.stringify(updated));
    
    // Update account balance if account_id exists
    if (transaction.account_id) {
      const updatedAccounts = accounts.map(acc => {
        if (acc.id === transaction.account_id) {
          const balanceChange = transaction.type === 'income' ? transaction.amount : -transaction.amount;
          return { ...acc, balance: (acc.balance || 0) + balanceChange };
        }
        return acc;
      });
      localStorage.setItem(`${STORAGE_KEYS.ACCOUNTS}_${userId}`, JSON.stringify(updatedAccounts));
    }

    loadData();
  };

  const deleteTransaction = async (id: number) => {
    if (!userId) return;
    const updated = transactions.filter(t => t.id !== id);
    localStorage.setItem(`${STORAGE_KEYS.TRANSACTIONS}_${userId}`, JSON.stringify(updated));
    loadData();
  };

  const addAccount = async (account: Omit<Account, 'id' | 'user_id'>) => {
    if (!userId) return;
    const newId = Date.now();
    const newAcc: Account = { ...account, id: newId, user_id: userId };
    const updated = [...accounts, newAcc];
    localStorage.setItem(`${STORAGE_KEYS.ACCOUNTS}_${userId}`, JSON.stringify(updated));
    loadData();
  };

  const addBudget = async (budget: Omit<Budget, 'id' | 'user_id'>) => {
    if (!userId) return;
    const newId = Date.now();
    const newBud: Budget = { ...budget, id: newId, user_id: userId };
    const updated = [...budgets, newBud];
    localStorage.setItem(`${STORAGE_KEYS.BUDGETS}_${userId}`, JSON.stringify(updated));
    loadData();
  };

  const addGoal = async (goal: Omit<Goal, 'id' | 'user_id'>) => {
    if (!userId) return;
    const newId = Date.now();
    const newGoal: Goal = { ...goal, id: newId, user_id: userId };
    const updated = [...goals, newGoal];
    localStorage.setItem(`${STORAGE_KEYS.GOALS}_${userId}`, JSON.stringify(updated));
    loadData();
  };

  const addBill = async (bill: Omit<Bill, 'id' | 'user_id' | 'is_paid'>) => {
    if (!userId) return;
    const newId = Date.now();
    const newBill: Bill = { ...bill, id: newId, user_id: userId, is_paid: false };
    const updated = [...bills, newBill];
    localStorage.setItem(`${STORAGE_KEYS.BILLS}_${userId}`, JSON.stringify(updated));
    loadData();
  };

  return { 
    transactions, 
    accounts, 
    budgets, 
    goals, 
    bills, 
    summary, 
    loading, 
    addTransaction, 
    deleteTransaction,
    addAccount,
    addBudget,
    addGoal,
    addBill,
    refresh: loadData 
  };
}
