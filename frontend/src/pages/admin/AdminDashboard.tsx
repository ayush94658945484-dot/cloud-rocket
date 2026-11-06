import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  DollarSign, 
  Users, 
  Clock, 
  TrendingUp, 
  Flame, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.getAdminStats();
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 font-bold text-sm animate-pulse">
        Loading real-time kitchen intelligence...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Kitchen Overview & Metrics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time sales, live tickets, and operational health metrics.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('orders')}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all self-start sm:self-auto flex items-center gap-2 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Manage Incoming Orders</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Total Sales</span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              ₹{Number(stats?.totalRevenue || 0).toFixed(0)}
            </h3>
            <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Live Kitchen Gross
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            ₹
          </div>
        </div>

        {/* Today's Orders */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Today's Orders</span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {stats?.todayOrders || 0}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Revenue today: ₹{Number(stats?.todayRevenue || 0).toFixed(0)}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* All-Time Orders */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Total Orders</span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {stats?.totalOrders || 0}
            </h3>
            <p className="text-[11px] text-orange-600 font-bold mt-1">
              Dispatched & Confirmed
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Active Customers */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Customers</span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {stats?.totalCustomers || 0}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Registered Foodies
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Status Distribution & Top Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Top Selling Dishes */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                <span>Top Selling Dishes</span>
              </h3>
              <p className="text-xs text-slate-400">Most requested by foodies this month</p>
            </div>
            <button
              onClick={() => onNavigateTab('food')}
              className="text-xs font-bold text-orange-600 hover:underline"
            >
              View Menu ➔
            </button>
          </div>

          <div className="space-y-3">
            {stats?.topDishes?.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No orders recorded yet.</p>
            ) : (
              stats?.topDishes?.map((dish: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 font-black text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{dish.food_name}</h4>
                      <span className="text-[10px] text-slate-400">
                        {dish.is_veg ? '🟢 Pure Veg' : '🔴 Non-Veg'} • {dish.total_quantity} orders
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-900">
                    ₹{Number(dish.total_sales).toFixed(0)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Order Status Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
          <div>
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <span>Orders by Operational Status</span>
            </h3>
            <p className="text-xs text-slate-400">Kitchen ticket breakdown</p>
          </div>

          <div className="space-y-2.5">
            {stats?.statusDistribution?.map((item: any, idx: number) => {
              const colors: Record<string, string> = {
                PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
                CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
                PREPARING: 'bg-orange-100 text-orange-800 border-orange-200',
                OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-800 border-purple-200',
                DELIVERED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                CANCELLED: 'bg-rose-100 text-rose-800 border-rose-200',
              };

              return (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-full border ${colors[item.order_status] || 'bg-slate-100 text-slate-800'}`}>
                    {item.order_status.replace(/_/g, ' ')}
                  </span>
                  <span className="font-black text-sm text-slate-900">
                    {item.count} orders
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

