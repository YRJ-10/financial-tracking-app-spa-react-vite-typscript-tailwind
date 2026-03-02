import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  History,
  TrendingUp,
  X,
  Trash2,
  Calendar,
  LogOut,
  User as UserIcon,
  Loader2,
  PieChart,
  Target,
  Bell,
  Settings,
  Repeat,
  Menu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { useFinance } from './hooks/useFinance';
import { useAuth } from './hooks/useAuth';
import { CATEGORIES } from './types';
import { AIAdvisor } from './components/AIAdvisor';
import { TransactionsView } from './components/TransactionsView';
import { AccountsView } from './components/AccountsView';
import { DashboardView } from './components/DashboardView';
import { BudgetingView } from './components/BudgetingView';
import { GoalsView } from './components/GoalsView';
import { BillsView } from './components/BillsView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { AuthView } from './components/AuthView';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const { user, login, logout, loading: authLoading } = useAuth();
  const finance = useFinance(user?.id);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    title: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: CATEGORIES[0],
    date: format(new Date(), 'yyyy-MM-dd'),
    account_id: ''
  });

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  if (!user) return <AuthView onLogin={login} />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await finance.addTransaction({
      ...newTransaction,
      amount: parseFloat(newTransaction.amount),
      account_id: newTransaction.account_id ? parseInt(newTransaction.account_id) : undefined
    });
    setIsModalOpen(false);
    setNewTransaction({
      title: '',
      amount: '',
      type: 'expense',
      category: CATEGORIES[0],
      date: format(new Date(), 'yyyy-MM-dd'),
      account_id: ''
    });
  };

  const balance = finance.summary.total_income - finance.summary.total_expense;

  return (
    <div className="min-h-screen flex bg-[#F8F9FB] relative overflow-x-hidden">
      {/* sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 z-40 h-screen bg-white border-r border-slate-200 transition-all duration-300 flex flex-col",
        isSidebarCollapsed ? "w-20" : "w-64",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        "p-4 md:p-6 overflow-y-auto"
      )}>
        <div className={cn("flex items-center gap-3 mb-10", isSidebarCollapsed ? "justify-center" : "justify-between")}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="min-w-[40px] w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <TrendingUp size={24} />
            </div>
            {!isSidebarCollapsed && <span className="font-bold text-xl tracking-tight whitespace-nowrap">FinTrack</span>}
          </div>
          
          {/* toggle show hide desktop */}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
          >
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* toggle show hide mobile */}
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1 flex-1">
          <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'dashboard'} collapsed={isSidebarCollapsed} onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} />
          <NavItem icon={<History size={18} />} label="Transactions" active={activeTab === 'transactions'} collapsed={isSidebarCollapsed} onClick={() => { setActiveTab('transactions'); setIsMobileMenuOpen(false); }} />
          <NavItem icon={<Wallet size={18} />} label="Accounts" active={activeTab === 'accounts'} collapsed={isSidebarCollapsed} onClick={() => { setActiveTab('accounts'); setIsMobileMenuOpen(false); }} />
          <NavItem icon={<PieChart size={18} />} label="Budgeting" active={activeTab === 'budgeting'} collapsed={isSidebarCollapsed} onClick={() => { setActiveTab('budgeting'); setIsMobileMenuOpen(false); }} />
          <NavItem icon={<Target size={18} />} label="Goals" active={activeTab === 'goals'} collapsed={isSidebarCollapsed} onClick={() => { setActiveTab('goals'); setIsMobileMenuOpen(false); }} />
          <NavItem icon={<Bell size={18} />} label="Bills" active={activeTab === 'bills'} collapsed={isSidebarCollapsed} onClick={() => { setActiveTab('bills'); setIsMobileMenuOpen(false); }} />
          <NavItem icon={<TrendingUp size={18} />} label="Reports" active={activeTab === 'reports'} collapsed={isSidebarCollapsed} onClick={() => { setActiveTab('reports'); setIsMobileMenuOpen(false); }} />
          <NavItem icon={<Repeat size={18} />} label="Recurring" active={activeTab === 'recurring'} collapsed={isSidebarCollapsed} onClick={() => { setActiveTab('recurring'); setIsMobileMenuOpen(false); }} />
          <NavItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'settings'} collapsed={isSidebarCollapsed} onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }} />
        </nav>

        <div className={cn("mt-10 space-y-4", isSidebarCollapsed ? "items-center" : "")}>
          <div className={cn("bg-slate-50 rounded-2xl p-3", isSidebarCollapsed ? "flex justify-center" : "p-4")}>
            <div className={cn("flex items-center gap-3", isSidebarCollapsed ? "" : "mb-3")}>
              <div className="min-w-[32px] w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                <UserIcon size={16} />
              </div>
              {!isSidebarCollapsed && (
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            )}
          </div>
          
          {!isSidebarCollapsed && (
            <div className="bg-indigo-600 rounded-2xl p-4 text-white">
              <p className="text-[10px] text-indigo-200 mb-1 uppercase font-bold tracking-wider">Total Balance</p>
              <p className="text-lg font-bold">${balance.toLocaleString()}</p>
            </div>
          )}
        </div>
      </aside>

      {/* mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* main content */}
      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full min-w-0">
        <header className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            {/* toggle menu mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Menu size={20} />
            </button>
            
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 capitalize">
                {activeTab.replace('-', ' ')}
              </h1>
              <p className="text-slate-500 text-xs md:text-sm hidden sm:block">
                {activeTab === 'dashboard' && `Welcome back, ${user.name.split(' ')[0]}!`}
                {activeTab === 'transactions' && "Track and manage every penny you spend or earn."}
                {activeTab === 'accounts' && "Manage your bank accounts, cards, and cash."}
                {activeTab === 'budgeting' && "Plan your spending and track your progress."}
                {activeTab === 'goals' && "Save up for what matters most to you."}
                {activeTab === 'bills' && "Never miss a payment again."}
                {activeTab === 'reports' && "Deep dive into your financial performance."}
                {activeTab === 'settings' && "Manage your account preferences."}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-200 font-medium"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Transaction</span>
          </button>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <DashboardView finance={finance} />}
            {activeTab === 'transactions' && <TransactionsView transactions={finance.transactions} onDelete={finance.deleteTransaction} />}
            {activeTab === 'accounts' && <AccountsView accounts={finance.accounts} onAdd={finance.addAccount} />}
            {activeTab === 'budgeting' && <BudgetingView budgets={finance.budgets} onAdd={finance.addBudget} />}
            {activeTab === 'goals' && <GoalsView goals={finance.goals} onAdd={finance.addGoal} />}
            {activeTab === 'bills' && <BillsView bills={finance.bills} onAdd={finance.addBill} />}
            {activeTab === 'reports' && <ReportsView finance={finance} />}
            {activeTab === 'settings' && <SettingsView user={user} logout={logout} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* transaction modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Add Transaction</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setNewTransaction({ ...newTransaction, type: 'expense' })}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                    newTransaction.type === 'expense' ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setNewTransaction({ ...newTransaction, type: 'income' })}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                    newTransaction.type === 'income' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                <input 
                  type="text" 
                  required
                  value={newTransaction.title}
                  onChange={e => setNewTransaction({ ...newTransaction, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="e.g., Grocery Shopping"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Amount</label>
                  <input 
                    type="number" 
                    required
                    value={newTransaction.amount}
                    onChange={e => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
                  <input 
                    type="date" 
                    required
                    value={newTransaction.date}
                    onChange={e => setNewTransaction({ ...newTransaction, date: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                <select 
                  value={newTransaction.category}
                  onChange={e => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Account</label>
                <select 
                  value={newTransaction.account_id}
                  onChange={e => setNewTransaction({ ...newTransaction, account_id: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Select Account</option>
                  {finance.accounts.map(a => <option key={a.id} value={a.id}>{a.name} (${a.balance})</option>)}
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 mt-4"
              >
                Add Transaction
              </button>
            </form>
          </motion.div>
        </div>
      )}

      <AIAdvisor transactions={finance.transactions} summary={finance.summary} />
    </div>
  );
}

function NavItem({ icon, label, active, collapsed, onClick }: { icon: React.ReactNode, label: string, active: boolean, collapsed?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
        active 
          ? "bg-indigo-50 text-indigo-600" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
        collapsed ? "justify-center px-0" : ""
      )}
    >
      <div className="min-w-[18px]">{icon}</div>
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}
