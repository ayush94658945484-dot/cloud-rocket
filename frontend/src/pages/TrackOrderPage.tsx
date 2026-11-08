import React, { useState, useEffect } from 'react';
import {
  Search,
  Clock,
  MapPin,
  CheckCircle2,
  Truck,
  ChefHat,
  AlertCircle,
  ShoppingBag,
  MessageCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';

interface TrackOrderPageProps {
  initialOrderNumber?: string;
  onExploreMenu: () => void;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({ initialOrderNumber = '', onExploreMenu }) => {
  const { settings } = useSettings();
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (numToTrack?: string) => {
    const num = (numToTrack || orderNumber).trim();
    if (!num) return;

    setLoading(true);
    setError(null);
    try {
      const res = await api.trackOrder(num);
      if (res.success && res.order) {
        setOrder(res.order);
        setItems(res.items || []);
      } else {
        setError('Order not found. Please verify your order number.');
        setOrder(null);
      }
    } catch (err: any) {
      setError(err.message || 'Order not found. Please verify your order ID.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      setOrderNumber(initialOrderNumber);
      handleTrack(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  // Status mapping
  const steps = [
    { key: 'PENDING', label: 'Order Received', desc: 'Ticket sent to kitchen' },
    { key: 'CONFIRMED', label: 'Confirmed', desc: 'Kitchen acknowledged order' },
    { key: 'PREPARING', label: 'Cooking in Handi', desc: 'Freshly prepared by chef' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Insulated hot thermal box on the way' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Enjoy your gourmet feast!' }
  ];

  const getStepIndex = (status: string) => {
    const upper = (status || '').toUpperCase();
    if (upper === 'CANCELLED') return -1;
    const idx = steps.findIndex(s => s.key === upper);
    return idx >= 0 ? idx : 0;
  };

  const currentStep = order ? getStepIndex(order.order_status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

      {/* Page Header with Official Food Rocket Logo */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="flex justify-center mb-1">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-white p-1 shadow-lg shadow-orange-500/20 ring-4 ring-emerald-500/40 hover:scale-105 transition-transform flex-shrink-0">
            <img
              src="/food-rocket-logo.png"
              alt="Food Rocket Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-emerald-100 dark:from-orange-950/60 dark:to-emerald-950/60 px-4 py-1.5 rounded-full border border-orange-200 dark:border-orange-800">
          <span className="text-xs font-black uppercase tracking-wider text-orange-700 dark:text-orange-300">
            Live Kitchen Tracking
          </span>
          <span className="text-xs">🚀</span>
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
            Fuel Your Hunger, Fast
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Track Your Delivery
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Enter your unique order number to check real-time cooking & dispatch milestones.
        </p>
      </div>

      {/* Search Order Number Input */}
      <div className="max-w-lg mx-auto bg-white dark:bg-slate-800 rounded-3xl p-3 border border-slate-200 dark:border-slate-700 shadow-md flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
            placeholder="e.g. CR-881924"
            className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>
        <button
          onClick={() => handleTrack()}
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Tracking...' : 'Track'}
        </button>
      </div>

      {error && (
        <div className="max-w-lg mx-auto p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Status Display */}
      {order && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-100 dark:border-slate-700 shadow-xl space-y-8 animate-in fade-in duration-300">

          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-700 gap-4">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">Active Order</span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-wide mt-0.5">
                {order.order_number}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Placed on {new Date(order.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </p>
            </div>

            <div className="sm:text-right">
              <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-black tracking-wider uppercase ${order.order_status === 'DELIVERED'
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                  : order.order_status === 'CANCELLED'
                    ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                    : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 animate-pulse'
                }`}>
                {order.order_status.replace(/_/g, ' ')}
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                Amount: ₹{Number(order.total_amount).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Stepper Pipeline */}
          {order.order_status === 'CANCELLED' ? (
            <div className="p-6 bg-rose-50 dark:bg-rose-950/60 rounded-2xl border border-rose-200 dark:border-rose-800 text-center space-y-2">
              <h3 className="text-base font-bold text-rose-800 dark:text-rose-300">This order was cancelled</h3>
              <p className="text-xs text-rose-600 dark:text-rose-400">Please contact customer support on WhatsApp for queries.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Kitchen Progress Milestones
              </h3>

              <div className="relative">
                {/* Connecting bar */}
                <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                  {steps.map((step, idx) => {
                    const isCompleted = idx <= currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div key={step.key} className="flex md:flex-col items-center md:text-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${isCompleted
                            ? 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-orange-500/30'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                          } ${isCurrent ? 'ring-4 ring-orange-200 dark:ring-orange-800 scale-110' : ''}`}>
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>
                        <div className="flex-1 md:flex-initial">
                          <p className={`text-xs font-bold ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                            {step.label}
                          </p>
                          <p className="text-[10px] text-slate-400 hidden sm:block">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Delivery & Items Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-700 text-xs">
            <div className="space-y-2 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                Delivery Address
              </h4>
              <p className="text-slate-700 dark:text-slate-300 font-semibold">{order.customer_name} ({order.customer_phone})</p>
              <p className="text-slate-500 dark:text-slate-400">{order.delivery_address}</p>
              {order.landmark && <p className="text-slate-400">Landmark: {order.landmark}</p>}
              {order.special_instructions && (
                <p className="text-orange-700 dark:text-orange-400 font-medium mt-1">Note: "{order.special_instructions}"</p>
              )}
            </div>

            <div className="space-y-2 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                Dishes in this Order
              </h4>
              <div className="space-y-1.5">
                {items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-slate-700 dark:text-slate-300 font-medium">
                    <span>{it.quantity}x {it.food_name}</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{it.total_price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Support Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Need assistance with your delivery?
            </span>
            <a
              href={`https://wa.me/${(settings.whatsapp_number || '919876543210').replace(/[^0-9]/g, '')}?text=Hi,%20I%20have%20a%20question%20regarding%20my%20order%20${order.order_number}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chat with Kitchen Team on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
