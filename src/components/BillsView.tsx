import React, { useState } from 'react';
import { Bell, Plus, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Bill, CATEGORIES } from '../types';
import { format } from 'date-fns';

interface BillsViewProps {
  bills: Bill[];
  onAdd: (bill: Omit<Bill, 'id' | 'user_id' | 'is_paid'>) => Promise<void>;
}

export const BillsView: React.FC<BillsViewProps> = ({ bills, onAdd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBill, setNewBill] = useState({
    name: '',
    amount: '',
    due_date: format(new Date(), 'yyyy-MM-dd'),
    category: 'Bills',
    is_recurring: false,
    frequency: 'Monthly'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd({
      name: newBill.name,
      amount: parseFloat(newBill.amount),
      due_date: newBill.due_date,
      category: newBill.category,
      is_recurring: newBill.is_recurring,
      frequency: newBill.is_recurring ? newBill.frequency : undefined
    });
    setIsModalOpen(false);
    setNewBill({ name: '', amount: '', due_date: format(new Date(), 'yyyy-MM-dd'), category: 'Bills', is_recurring: false, frequency: 'Monthly' });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Bills & Reminders</h2>
          <p className="text-slate-500 text-sm">Never miss a payment again.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-200 font-medium"
        >
          <Plus size={20} />
          <span>Add New Bill</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bills.map(bill => (
          <div key={bill.id} className={`bg-white rounded-3xl p-6 border shadow-sm transition-all ${bill.is_paid ? 'border-slate-100 opacity-75' : 'border-rose-100'}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bill.is_paid ? 'bg-slate-50 text-slate-400' : 'bg-rose-50 text-rose-600'}`}>
                  {bill.is_paid ? <CheckCircle size={20} /> : <Bell size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{bill.name}</h4>
                  <p className="text-xs text-slate-500">{bill.category}</p>
                </div>
              </div>
              <p className={`font-bold ${bill.is_paid ? 'text-slate-400' : 'text-rose-600'}`}>${(bill.amount ?? 0).toLocaleString()}</p>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar size={14} />
                <span>Due {format(new Date(bill.due_date), 'MMM dd, yyyy')}</span>
              </div>
              {bill.is_recurring && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase">
                  <Clock size={10} />
                  <span>{bill.frequency}</span>
                </div>
              )}
            </div>
            
            {!bill.is_paid && (
              <button className="w-full mt-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all">
                Mark as Paid
              </button>
            )}
          </div>
        ))}

        {bills.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={32} />
            </div>
            <h3 className="font-bold text-slate-900">No bills added yet</h3>
            <p className="text-sm text-slate-500">Add your recurring bills and subscriptions to track them here.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Add New Bill</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Bill Name</label>
                <input 
                  type="text"
                  required
                  value={newBill.name}
                  onChange={e => setNewBill({ ...newBill, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g., Netflix, Rent, Electricity"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Amount</label>
                  <input 
                    type="number"
                    required
                    value={newBill.amount}
                    onChange={e => setNewBill({ ...newBill, amount: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Due Date</label>
                  <input 
                    type="date"
                    required
                    value={newBill.due_date}
                    onChange={e => setNewBill({ ...newBill, due_date: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                <input 
                  type="checkbox"
                  id="is_recurring"
                  checked={newBill.is_recurring}
                  onChange={e => setNewBill({ ...newBill, is_recurring: e.target.checked })}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="is_recurring" className="text-sm font-bold text-slate-700">Recurring Bill</label>
              </div>
              {newBill.is_recurring && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Frequency</label>
                  <select 
                    value={newBill.frequency}
                    onChange={e => setNewBill({ ...newBill, frequency: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              )}
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
                  Add Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
