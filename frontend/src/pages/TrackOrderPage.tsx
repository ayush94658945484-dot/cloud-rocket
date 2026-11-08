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
  MessageCircle,
  ShieldCheck,
  Package,
  Sparkles,
  Rocket
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

  // 7-Stage Rocket Mission Tracking
  const missionStages = [
    { key: 'PENDING', label: '1. Order Received', desc: 'Telemetry ticket logged in kitchen' },
    { key: 'CONFIRMED', label: '2. Kitchen Accepted', desc: 'Master chef acknowledged coordinates' },
    { key: 'PREPARING', label: '3. Food Preparation', desc: '1,000°F clay tandoor cooking' },
    { key: 'QUALITY_CHECK', label: '4. Quality Check', desc: 'Chef aroma & temperature inspection' },
    { key: 'PACKED', label: '5. Packed & Sealed', desc: 'Airtight thermal tamper-proof seal' },
    { key: 'OUT_FOR_DELIVERY', label: '6. Out for Delivery', desc: 'Supersonic courier airborne' },
    { key: 'DELIVERED', label: '7. Delivered Hot', desc: 'Landed fresh on your dining plate!' },
  ];

  const getStepIndex = (status: string) => {
    const upper = (status || '').toUpperCase();
    if (upper === 'CANCELLED') return -1;
    if (upper === 'PENDING' || upper === 'ORDER_RECEIVED') return 0;
    if (upper === 'CONFIRMED' || upper === 'KITCHEN_ACCEPTED') return 1;
    if (upper === 'PREPARING') return 2;
    if (upper === 'QUALITY_CHECK' || upper === 'CHECKED') return 3;
    if (upper === 'PACKED') return 4;
    if (upper === 'OUT_FOR_DELIVERY') return 5;
    if (upper === 'DELIVERED') return 6;
    return 0;
  };

  const currentStep = order ? getStepIndex(order.order_status) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

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
            7-Stage Rocket Mission Tracking
          </span>
          <span className="text-xs">🚀</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Track Your Delivery Mission
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Real-time telemetry connected to live clay tandoors & supersonic doorstep dispatch.
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
              <span className="text-xs text-slate-400 font-semibold block">Active Delivery Mission</span>
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

          {/* 7-Stage Rocket Stepper Pipeline */}
          {order.order_status === 'CANCELLED' ? (
            <div className="p-6 bg-rose-50 dark:bg-rose-950/60 rounded-2xl border border-rose-200 dark:border-rose-800 text-center space-y-2">
              <h3 className="text-base font-bold text-rose-800 dark:text-rose-300">This mission was cancelled</h3>
              <p className="text-xs text-rose-600 dark:text-rose-400">Please contact customer support on WhatsApp for queries.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-orange-500" />
                  <span>Mission Flight Telemetry (Stage {currentStep + 1} of 7)</span>
                </h3>
                <span className="text-xs font-mono text-emerald-500 font-black">
                  EST: 30-40 MIN ARRIVAL
                </span>
              </div>

              <div className="relative">
                {/* Connecting bar */}
                <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 transition-all duration-700"
                    style={{ width: `${(currentStep / (missionStages.length - 1)) * 100}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 relative z-10">
                  {missionStages.map((step, idx) => {
                    const isCompleted = idx <= currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div key={step.key} className="flex lg:flex-col items-center lg:text-center gap-2.5 bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${isCompleted
                            ? 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-orange-500/30'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                          } ${isCurrent ? 'ring-4 ring-orange-400 dark:ring-orange-800 scale-110 animate-bounce' : ''}`}>
                          {isCurrent ? '🚀' : isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div className="flex-1 lg:flex-initial">
                          <p className={`text-[11px] font-black leading-tight ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                            {step.label}
                          </p>
                          <p className="text-[9px] text-slate-400 hidden xl:block mt-0.5">
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
                Drop Coordinates
              </h4>
              <p className="text-slate-600 dark:text-slate-300 font-medium">
                {order.customer_name} ({order.customer_phone})
              </p>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {order.delivery_address}
                {order.landmark ? `, Landmark: ${order.landmark}` : ''}
              </p>
              {order.special_instructions && (
                <p className="text-[11px] text-orange-600 dark:text-orange-400 italic">
                  Note: "{order.special_instructions}"
                </p>
              )}
            </div>

            <div className="space-y-2 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                Delicacy Summary ({items.length} items)
              </h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span className="truncate pr-2">
                      {it.quantity}x {it.food_name}
                    </span>
                    <span className="font-mono font-semibold">
                      ₹{Number(it.total_price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* WhatsApp Support Callout */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/60">
            <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium text-center sm:text-left">
              Questions regarding this delivery mission? Chat with our Kitchen Operations Flight Control.
            </span>
            <a
              href={`https://wa.me/${(settings.whatsapp_number || '919876543210').replace(/[^0-9]/g, '')}?text=Hi,%20I%20have%20a%20question%20regarding%20my%20order%20${order.order_number}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex-shrink-0"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Flight Control</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
