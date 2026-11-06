import React from 'react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  Tag, 
  Users, 
  Settings as SettingsIcon, 
  ArrowLeft,
  Flame,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

interface AdminLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onBackToStore: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  onTabChange,
  onBackToStore,
  children
}) => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();

  const navItems = [
    { id: 'dashboard', label: 'Overview Analytics', icon: LayoutDashboard },
    { id: 'orders', label: 'Live Orders Management', icon: ShoppingBag, badge: 'Live' },
    { id: 'food', label: 'Menu & Food Dishes', icon: UtensilsCrossed },
    { id: 'coupons', label: 'Offers & Discounts', icon: Tag },
    { id: 'customers', label: 'Customer Directory', icon: Users },
    { id: 'settings', label: 'Website & WhatsApp Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 lg:w-72 bg-slate-950 text-white flex flex-col justify-between p-5 border-r border-slate-900 flex-shrink-0">
        <div className="space-y-6">
          
          {/* Brand header */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold shadow-md shadow-orange-600/30">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-sm tracking-wide text-white leading-tight">
                {settings.business_name || 'Cloud Rocket'}
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-widest text-orange-400 block">
                Kitchen Command Center
              </span>
            </div>
          </div>

          {/* Nav Items List */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-emerald-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-900 space-y-2">
          <div className="px-3 py-2 bg-slate-900/60 rounded-xl mb-3 flex items-center gap-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div className="overflow-hidden">
              <p className="font-bold text-white truncate text-[11px]">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-500">Root Access</p>
            </div>
          </div>

          <button
            onClick={onBackToStore}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-orange-500" />
            <span>Return to Customer Store</span>
          </button>

          <button
            onClick={() => {
              logout();
              onBackToStore();
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

