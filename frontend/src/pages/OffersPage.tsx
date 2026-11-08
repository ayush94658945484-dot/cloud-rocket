import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, Check, Clock, ShoppingBag, ArrowRight } from 'lucide-react';
import { Coupon } from '../types';
import { api } from '../services/api';

interface OffersPageProps {
  onExploreMenu: () => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({ onExploreMenu }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await api.getCoupons();
        if (res.success && res.coupons) {
          setCoupons(res.coupons);
        }
      } catch (err) {
        console.warn('Failed to load coupons:', err);
      }
    };
    fetchCoupons();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

      {/* Page Header with Official Food Rocket Logo */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
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
            Food Rocket Deals
          </span>
          <span className="text-xs">🚀</span>
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
            Fuel Your Hunger, Fast
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Exclusive Kitchen Offers
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Enjoy mouth-watering discounts, festive feasts, and free delivery vouchers on every feast.
        </p>
      </div>

      {/* Featured Big Promo Banner */}
      <div className="bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl text-center md:text-left">
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase text-amber-200">
            ⭐ Deal of the Day
          </span>
          <h2 className="text-3xl sm:text-4xl font-black">
            Get 50% OFF On Your First Feast!
          </h2>
          <p className="text-slate-100 text-xs sm:text-sm leading-relaxed">
            Order authentic clay-oven smoked kebabs or fragrant handi biryanis and enjoy an instant 50% discount up to ₹100.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-2xl tracking-widest shadow-lg border-2 border-dashed border-orange-400">
            WELCOME50
          </div>
          <button
            onClick={() => handleCopy('WELCOME50')}
            className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            {copiedCode === 'WELCOME50' ? 'Copied to Clipboard! ✓' : 'Copy Promo Code'}
          </button>
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-5 relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 uppercase">
                  {coupon.discount_type === 'PERCENTAGE'
                    ? `${coupon.discount_value}% Discount`
                    : `Flat ₹${coupon.discount_value} OFF`}
                </span>
                <Tag className="w-5 h-5 text-orange-500" />
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-wide">
                {coupon.code}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {coupon.description}
              </p>

              <div className="pt-2 text-[11px] text-slate-400 space-y-1">
                <p>• Minimum order amount: ₹{coupon.min_order_amount}</p>
                {coupon.max_discount_amount && (
                  <p>• Maximum savings cap: ₹{coupon.max_discount_amount}</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <button
                onClick={() => handleCopy(coupon.code)}
                className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
              >
                {copiedCode === coupon.code ? 'Copied! ✓' : 'Copy Code'}
              </button>

              <button
                onClick={onExploreMenu}
                className="bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Use in Menu
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
