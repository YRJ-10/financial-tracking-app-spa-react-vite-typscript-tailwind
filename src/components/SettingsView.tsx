import React from 'react';
import { User, Shield, Bell, Globe, Moon, LogOut, Cloud, Database } from 'lucide-react';

interface SettingsViewProps {
  user: any;
  logout: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, logout }) => {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500 text-sm">Manage your account preferences and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-1">
          <SettingsTab icon={<User size={18} />} label="Profile Info" active />
          <SettingsTab icon={<Shield size={18} />} label="Security" />
          <SettingsTab icon={<Bell size={18} />} label="Notifications" />
          <SettingsTab icon={<Globe size={18} />} label="Preferences" />
          <SettingsTab icon={<Cloud size={18} />} label="Backup & Sync" />
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-lg mb-6">Profile Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center">
                  <User size={40} />
                </div>
                <div>
                  <button className="text-sm font-bold text-indigo-600 hover:underline">Change Avatar</button>
                  <p className="text-xs text-slate-400 mt-1">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
                  <input type="text" defaultValue={user?.name} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                  <input type="email" defaultValue={user?.email} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-50">
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all">
                Save Changes
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-lg mb-6">Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-indigo-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-indigo-600 bg-white px-4 py-2 rounded-lg border border-slate-200">Enable</button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Database size={20} className="text-indigo-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Data Export</p>
                    <p className="text-xs text-slate-500">Download all your financial data in CSV format.</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-lg border border-slate-200">Export</button>
              </div>
            </div>
          </div>

          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-4 bg-rose-50 text-rose-600 font-bold rounded-2xl hover:bg-rose-100 transition-all"
          >
            <LogOut size={20} />
            <span>Sign Out from All Devices</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100'}`}>
    {icon}
    <span>{label}</span>
  </button>
);
