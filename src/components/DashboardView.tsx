import React from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp,
  Plus,
  Calendar,
  Bell,
  Target
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { Transaction, Summary, Account, Budget, Goal, Bill } from '../types';
import { motion } from 'motion/react';

interface DashboardViewProps {
  finance: {
    transactions: Transaction[];
    summary: Summary;
    accounts: Account[];
    budgets: Budget[];
    goals: Goal[];
    bills: Bill[];
    loading: boolean;
    deleteTransaction: (id: number) => Promise<void>;
  };
}

export const DashboardView: React.FC<DashboardViewProps> = ({ finance }) => {
  const { transactions, summary, accounts, budgets, goals, bills, loading } = finance;

  const totalIncome = summary?.total_income ?? 0;
  const totalExpense = summary?.total_expense ?? 0;
  const balance = totalIncome - totalExpense;
  const netWorth = accounts.reduce((acc, curr) => acc + (curr.balance ?? 0), 0);

  // Chart Data
  const chartData = transactions
    .slice()
    .reverse()
    .reduce((acc: any[], curr) => {
      const date = format(parseISO(curr.date), 'MMM dd');
      const existing = acc.find(item => item.date === date);
      if (existing) {
        if (curr.type === 'income') existing.income += curr.amount;
        else existing.expense += curr.amount;
      } else {
        acc.push({
          date,
          income: curr.type === 'income' ? curr.amount : 0,
          expense: curr.type === 'expense' ? curr.amount : 0
        });
      }
      return acc;
    }, [])
    .slice(-7);

  const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6'];

  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any[], curr) => {
      const existing = acc.find(item => item.name === curr.category);
      if (existing) existing.value += curr.amount;
      else acc.push({ name: curr.category, value: curr.amount });
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  if (loading) return <div className="flex items-center justify-center h-64">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Balance" value={balance} icon={<Wallet />} color="indigo" />
        <StatCard title="Net Worth" value={netWorth} icon={<TrendingUp />} color="emerald" />
        <StatCard title="Monthly Income" value={totalIncome} icon={<ArrowUpRight />} color="emerald" />
        <StatCard title="Monthly Expenses" value={totalExpense} icon={<ArrowDownLeft />} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm min-w-0">
          <h3 className="font-bold text-lg mb-6">Cashflow Trend</h3>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending by Category */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Spending by Category</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {t.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{t.title}</p>
                    <p className="text-xs text-slate-500">{t.category} • {format(parseISO(t.date), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                <p className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Goals & Bills Preview */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Target size={20} className="text-indigo-600" />
              Active Goals
            </h3>
            <div className="space-y-4">
              {goals.slice(0, 3).map(goal => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{goal.name}</span>
                    <span className="text-slate-500">{Math.round((goal.current_amount / goal.target_amount) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full" 
                      style={{ width: `${(goal.current_amount / goal.target_amount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Bell size={20} className="text-rose-600" />
              Upcoming Bills
            </h3>
            <div className="space-y-4">
              {bills.filter(b => !b.is_paid).slice(0, 3).map(bill => (
                <div key={bill.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{bill.name}</p>
                    <p className="text-xs text-slate-500">Due {format(parseISO(bill.due_date), 'MMM dd')}</p>
                  </div>
                  <p className="text-sm font-bold text-rose-600">${bill.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) => (
  <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
      color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : 
      color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 
      'bg-rose-50 text-rose-600'
    }`}>
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24 }) : icon}
    </div>
    <p className="text-sm text-slate-500 mb-1">{title}</p>
    <p className="text-2xl font-bold text-slate-900">${(value ?? 0).toLocaleString()}</p>
  </div>
);
