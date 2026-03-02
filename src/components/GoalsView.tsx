import React, { useState } from 'react';
import { Target, Plus, Calendar, TrendingUp } from 'lucide-react';
import { Goal } from '../types';
import { format } from 'date-fns';

interface GoalsViewProps {
  goals: Goal[];
  onAdd: (goal: Omit<Goal, 'id' | 'user_id'>) => Promise<void>;
}

export const GoalsView: React.FC<GoalsViewProps> = ({ goals, onAdd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    target_amount: '',
    current_amount: '0',
    deadline: format(new Date(), 'yyyy-MM-dd'),
    priority: 'Medium' as 'Low' | 'Medium' | 'High'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd({
      name: newGoal.name,
      target_amount: parseFloat(newGoal.target_amount),
      current_amount: parseFloat(newGoal.current_amount),
      deadline: newGoal.deadline,
      priority: newGoal.priority
    });
    setIsModalOpen(false);
    setNewGoal({ name: '', target_amount: '', current_amount: '0', deadline: format(new Date(), 'yyyy-MM-dd'), priority: 'Medium' });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Savings Goals</h2>
          <p className="text-slate-500 text-sm">Save up for what matters most to you.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-200 font-medium"
        >
          <Plus size={20} />
          <span>Create New Goal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => {
          const progress = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
          return (
            <div key={goal.id} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <Target size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-slate-900">{goal.name}</h4>
                    <p className="text-sm text-slate-500">Target: ${(goal.target_amount ?? 0).toLocaleString()}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  goal.priority === 'High' ? 'bg-rose-50 text-rose-600' : 
                  goal.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 
                  'bg-emerald-50 text-emerald-600'
                }`}>
                  {goal.priority} Priority
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">${(goal.current_amount ?? 0).toLocaleString()}</p>
                    <p className="text-xs text-slate-500">Saved so far</p>
                  </div>
                  <p className="text-sm font-bold text-indigo-600">{progress}%</p>
                </div>
                
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center gap-4 pt-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>Deadline: {goal.deadline ? format(new Date(goal.deadline), 'MMM dd, yyyy') : 'No deadline'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={14} />
                    <span>${((goal.target_amount ?? 0) - (goal.current_amount ?? 0)).toLocaleString()} left</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {goals.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target size={32} />
            </div>
            <h3 className="font-bold text-slate-900">No goals created yet</h3>
            <p className="text-sm text-slate-500">Start saving for your dreams by creating a new goal.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Create New Goal</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Goal Name</label>
                <input 
                  type="text"
                  required
                  value={newGoal.name}
                  onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g., New Car, Vacation"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Target Amount</label>
                  <input 
                    type="number"
                    required
                    value={newGoal.target_amount}
                    onChange={e => setNewGoal({ ...newGoal, target_amount: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Initial Savings</label>
                  <input 
                    type="number"
                    value={newGoal.current_amount}
                    onChange={e => setNewGoal({ ...newGoal, current_amount: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Deadline</label>
                <input 
                  type="date"
                  value={newGoal.deadline}
                  onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Priority</label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewGoal({ ...newGoal, priority: p as any })}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${newGoal.priority === p ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
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
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
