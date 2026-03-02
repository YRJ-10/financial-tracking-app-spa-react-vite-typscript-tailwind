import React, { useState } from 'react';
import { PieChart, Plus, TrendingUp, AlertCircle } from 'lucide-react';
import { Budget, CATEGORIES } from '../types';

interface BudgetingViewProps {
  budgets: Budget[];
  onAdd: (budget: Omit<Budget, 'id' | 'user_id'>) => Promise<void>;
}

export const BudgetingView: React.FC<BudgetingViewProps> = ({ budgets, onAdd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: CATEGORIES[0],
    amount: '',
    period: 'Monthly' as 'Weekly' | 'Monthly'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd({
      category: newBudget.category,
      amount: parseFloat(newBudget.amount),
      period: newBudget.period
    });
    setIsModalOpen(false);
    setNewBudget({ category: CATEGORIES[0], amount: '', period: 'Monthly' });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Budgeting</h2>
          <p className="text-slate-500 text-sm">Plan your spending and track your progress.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-200 font-medium"
        >
          <Plus size={20} />
          <span>Set New Budget</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map(budget => (
          <div key={budget.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <PieChart size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{budget.category}</h4>
                  <p className="text-xs text-slate-500">{budget.period} Budget</p>
                </div>
              </div>
              <p className="font-bold text-slate-900">${(budget.amount ?? 0).toLocaleString()}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Spent: $0</span>
                <span className="text-slate-500">Remaining: ${(budget.amount ?? 0).toLocaleString()}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-0" />
              </div>
            </div>
          </div>
        ))}

        {budgets.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <PieChart size={32} />
            </div>
            <h3 className="font-bold text-slate-900">No budgets set yet</h3>
            <p className="text-sm text-slate-500">Start planning your finances by setting a budget for a category.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Set New Budget</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                <select 
                  value={newBudget.category}
                  onChange={e => setNewBudget({ ...newBudget, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Amount</label>
                <input 
                  type="number"
                  required
                  value={newBudget.amount}
                  onChange={e => setNewBudget({ ...newBudget, amount: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Period</label>
                <div className="flex gap-4">
                  {['Weekly', 'Monthly'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewBudget({ ...newBudget, period: p as any })}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${newBudget.period === p ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  Set Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
