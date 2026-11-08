import React, { useEffect } from 'react';
import { CheckCircle2, MessageCircle, Clock, MapPin, ArrowRight, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSettings } from '../context/SettingsContext';

interface OrderSuccessPageProps {
  order: any;
  whatsappUrl?: string;
  onNavigate: (page: string, params?: any) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ order, whatsappUrl, onNavigate }) => {
  const { settings } = useSettings();

  useEffect(() => {
    // Shoot celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <h2 className="text-xl font-bold">No recent order found</h2>
        <button
          onClick={() => onNavigate('home')}
          className="mt-4 bg-orange-600 text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center space-y-8">
      
      {/* Official Food Rocket Logo & Animated Success Badge */}
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-white p-1 shadow-xl shadow-orange-500/20 ring-4 ring-emerald-500/40 hover:scale-105 transition-transform flex-shrink-0">
          <img 
            src="/food-rocket-logo.png" 
            alt="Food Rocket Logo" 
            className="w-full h-full object-contain rounded-full" 
          />
        </div>
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>
      </div>

      {/* Headings */}
      <div className="space-y-2">
        <span className="text-emerald-700 dark:text-emerald-300 font-extrabold text-xs uppercase tracking-widest bg-emerald-100 dark:bg-emerald-950/60 px-3.5 py-1 rounded-full border border-emerald-300/40">
          Order Confirmed & Received!
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Your Feast is Being Prepared!
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto">
          Thank you for choosing <strong>{settings.business_name || 'Food Rocket'}</strong>. Our master chefs have received your ticket and begun preparations.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700 shadow-md text-left space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4 gap-2">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Order Identifier</span>
            <span className="text-xl font-black text-orange-600 tracking-wider">
              {order.order_number}
            </span>
          </div>
          <div className="text-right sm:text-right">
            <span className="text-xs text-slate-400 font-medium block">Total Paid</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">
              ₹{Number(order.total_amount).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Estimated Delivery Time</p>
              <p className="text-slate-500 dark:text-slate-400">{settings.delivery_time_estimate || '30-40 mins'}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Delivery Address</p>
              <p className="text-slate-500 dark:text-slate-400 line-clamp-2">{order.delivery_address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Reopen Button */}
      {whatsappUrl && (
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
          <p className="text-xs text-emerald-800 dark:text-emerald-200 font-medium">
            Did WhatsApp not open automatically? Click below to send your pre-filled order receipt:
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm px-6 py-3 rounded-xl shadow-md transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Open Order in WhatsApp</span>
          </a>
        </div>
      )}

      {/* Action Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => onNavigate('track', { orderNumber: order.order_number })}
          className="w-full sm:w-auto bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Track Live Order Status</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => onNavigate('home')}
          className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
};
