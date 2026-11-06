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
      
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-orange-600 font-extrabold text-xs uppercase tracking-widest bg-orange-100 px-3 py-1 rounded-full">
          Live Kitchen Tracking
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Track Your Delivery
        </h1>
        <p className="text-slate-500 text-sm">
          Enter your unique order number to check real-time cooking & dispatch milestones.
        </p>
      </div>

      {/* Search Order Number Input */}
      <div className="max-w-lg mx-auto bg-white rounded-3xl p-3 border border-slate-200 shadow-md flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
            placeholder="e.g. RZ-881924"
            className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white"
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
        <div className="max-w-lg mx-auto p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Status Display */}
      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl space-y-8 animate-in fade-in duration-300">
          
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">Active Order</span>
              <h2 className="text-2xl font-black text-slate-900 tracking-wide mt-0.5">
                {order.order_number}
              </h2>
              <p className="text-xs text-slate-500">
                Placed on {new Date(order.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </p>
            </div>

            <div className="sm:text-right">
              <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-black tracking-wider uppercase ${
                order.order_status === 'DELIVERED' 
                  ? 'bg-emerald-100 text-emerald-800'
                  : order.order_status === 'CANCELLED'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800 animate-pulse'
              }`}>
                {order.order_status.replace(/_/g, ' ')}
              </span>
              <p className="text-xs font-bold text-slate-800 mt-1">
                Amount: ₹{Number(order.total_amount).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Stepper Pipeline */}
          {order.order_status === 'CANCELLED' ? (
            <div className="p-6 bg-rose-50 rounded-2xl border border-rose-200 text-center space-y-2">
              <h3 className="text-base font-bold text-rose-800">This order was cancelled</h3>
              <p className="text-xs text-rose-600">Please contact customer support on WhatsApp for queries.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                Kitchen Progress Milestones
              </h3>

              <div className="relative">
                {/* Connecting bar */}
                <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0">
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
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                          isCompleted
                            ? 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-orange-500/30'
                            : 'bg-slate-200 text-slate-400'
                        } ${isCurrent ? 'ring-4 ring-orange-200 scale-110' : ''}`}>
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>
                        <div className="flex-1 md:flex-initial">
                          <p className={`text-xs font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 text-xs">
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Delivery Address
              </h4>
              <p className="text-slate-700 font-semibold">{order.customer_name} ({order.customer_phone})</p>
              <p className="text-slate-500">{order.delivery_address}</p>
              {order.landmark && <p className="text-slate-400">Landmark: {order.landmark}</p>}
              {order.special_instructions && (
                <p className="text-orange-700 font-medium mt-1">Note: "{order.special_instructions}"</p>
              )}
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Dishes in this Order
              </h4>
              <div className="space-y-1.5">
                {items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-slate-700 font-medium">
                    <span>{it.quantity}x {it.food_name}</span>
                    <span className="font-bold text-slate-900">₹{it.total_price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Support Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Need assistance with your delivery?
            </span>
            <a
              href={`https://wa.me/${(settings.whatsapp_number || '919876543210').replace(/[^0-9]/g, '')}?text=Hi,%20I%20have%20a%20question%20regarding%20my%20order%20${order.order_number}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all"
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

