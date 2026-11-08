import React from 'react';
import { 
  X, 
  Bike, 
  ShoppingBag, 
  Sun, 
  Moon, 
  Leaf, 
  UtensilsCrossed, 
  Check, 
  Sparkles,
  Sliders
} from 'lucide-react';
import { useMode } from '../context/ModeContext';

export const ModeModal: React.FC = () => {
  const {
    orderMode,
    setOrderMode,
    dietaryMode,
    setDietaryMode,
    themeMode,
    setThemeMode,
    isModeModalOpen,
    closeModeModal
  } = useMode();

  if (!isModeModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 p-6 text-white text-center">
          <button
            onClick={closeModeModal}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-md">
            <Sliders className="w-6 h-6 text-white" />
          </div>

          <h3 className="text-2xl font-black tracking-tight text-white">
            Choose Your Dining Mode
          </h3>
          <p className="text-xs text-amber-100 mt-1 max-w-sm mx-auto">
            Customize your ordering preferences, dietary choices, and visual theme.
          </p>
        </div>

        {/* Modal Options Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* 1. ORDERING / FULFILLMENT MODE */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Bike className="w-4 h-4 text-orange-500" />
                1. Order Fulfillment Mode
              </span>
              <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 px-2.5 py-0.5 rounded-full">
                {orderMode === 'delivery' ? '🛵 Doorstep Delivery' : '🥡 Kitchen Pickup'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderMode('delivery')}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative cursor-pointer ${
                  orderMode === 'delivery'
                    ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/40 text-slate-900 dark:text-white shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {orderMode === 'delivery' && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-2">
                  <Bike className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Doorstep Delivery</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Hot & fresh in insulated boxes (30-40 mins)
                </p>
              </button>

              <button
                type="button"
                onClick={() => setOrderMode('pickup')}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative cursor-pointer ${
                  orderMode === 'pickup'
                    ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/40 text-slate-900 dark:text-white shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {orderMode === 'pickup' && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Self Takeaway / Pickup</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Pick up from kitchen in 15 mins (₹0 fee)
                </p>
              </button>
            </div>
          </div>

          {/* 2. DIETARY PREFERENCE MODE */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-500" />
                2. Dietary Preference Mode
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                dietaryMode === 'veg' 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {dietaryMode === 'veg' ? '🟢 100% Pure Veg' : '🍖 All Food Dishes'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDietaryMode('veg')}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative cursor-pointer ${
                  dietaryMode === 'veg'
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-slate-900 dark:text-white shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {dietaryMode === 'veg' && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                  <Leaf className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">100% Pure Veg Mode</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Only show pure vegetarian curries, paneer & biryani
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDietaryMode('all')}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative cursor-pointer ${
                  dietaryMode === 'all'
                    ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/40 text-slate-900 dark:text-white shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {dietaryMode === 'all' && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-2">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">All Delicacies Mode</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Full culinary menu including murgh, mutton & kebabs
                </p>
              </button>
            </div>
          </div>

          {/* 3. THEME & AMBIANCE MODE */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-500" />
                3. Display Theme Mode
              </span>
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                {themeMode === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setThemeMode('light')}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative cursor-pointer ${
                  themeMode === 'light'
                    ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-slate-900 dark:text-white shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {themeMode === 'light' && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
                  <Sun className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Daylight Mode</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Clean, bright & vibrant daylight aesthetic
                </p>
              </button>

              <button
                type="button"
                onClick={() => setThemeMode('dark')}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative cursor-pointer ${
                  themeMode === 'dark'
                    ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 text-slate-900 dark:text-white shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {themeMode === 'dark' && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
                  <Moon className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Dark Luxury Mode</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Midnight gourmet dining contrast
                </p>
              </button>
            </div>
          </div>

        </div>

        {/* Footer Apply Button */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={closeModeModal}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-sm py-3.5 rounded-2xl shadow-lg shadow-orange-600/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Apply Selected Modes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
