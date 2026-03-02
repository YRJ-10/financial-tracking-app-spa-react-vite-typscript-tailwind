import React, { useState } from 'react';
import { Wallet, Plus, CreditCard, Landmark, Banknote, TrendingUp, MoreVertical } from 'lucide-react';
import { Account } from '../types';

interface AccountsViewProps {
  accounts: Account[];
  onAdd: (account: Omit<Account, 'id' | 'user_id'>) => Promise<void>;
}

export const AccountsView: React.FC<AccountsViewProps> = ({ accounts, onAdd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'Bank' as Account['type'],
    balance: '',
    color: '#6366f1'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd({
      name: newAccount.name,
      type: newAccount.type,
      balance: parseFloat(newAccount.balance),
      color: newAccount.color
    });
    setIsModalOpen(false);
    setNewAccount({ name: '', type: 'Bank', balance: '', color: '#6366f1' });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Bank': return <Landmark size={24} />;
      case 'Credit Card': return <CreditCard size={24} />;
      case 'Investment': return <TrendingUp size={24} />;
      case 'E-Wallet': return <Banknote size={24} />;
      default: return <Wallet size={24} />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Accounts</h2>
          <p className="text-slate-500 text-sm">Manage your bank accounts, cards, and cash.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-200 font-medium"
        >
          <Plus size={20} />
          <span>Add Account</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(account => (
          <div key={account.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 transition-all group-hover:scale-110" />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: account.color || '#6366f1' }}>
                  {getIcon(account.type)}
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-600">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{account.type}</p>
                <h4 className="text-lg font-bold text-slate-900">{account.name}</h4>
              </div>

              <div className="mt-8">
                <p className="text-xs text-slate-500 mb-1">Current Balance</p>
                <p className="text-2xl font-bold text-slate-900">${(account.balance ?? 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}

        {accounts.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Landmark size={32} />
            </div>
            <h3 className="font-bold text-slate-900">No accounts linked yet</h3>
            <p className="text-sm text-slate-500">Add your first bank account or e-wallet to start tracking.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Add New Account</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Account Name</label>
                <input 
                  type="text"
                  required
                  value={newAccount.name}
                  onChange={e => setNewAccount({ ...newAccount, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g., Main Savings, Credit Card"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Account Type</label>
                <select 
                  value={newAccount.type}
                  onChange={e => setNewAccount({ ...newAccount, type: e.target.value as any })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Bank">Bank Account</option>
                  <option value="E-Wallet">E-Wallet</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Investment">Investment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Initial Balance</label>
                <input 
                  type="number"
                  required
                  value={newAccount.balance}
                  onChange={e => setNewAccount({ ...newAccount, balance: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Theme Color</label>
                <div className="flex gap-3">
                  {['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewAccount({ ...newAccount, color: c })}
                      className={`w-10 h-10 rounded-xl transition-all ${newAccount.color === c ? 'ring-4 ring-slate-200 scale-110' : ''}`}
                      style={{ backgroundColor: c }}
                    />
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
                  Add Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
