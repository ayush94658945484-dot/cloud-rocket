import React, { useState } from 'react';
import { X, Clock, Flame, ShoppingBag, Plus, Minus, ShieldCheck, Sparkles } from 'lucide-react';
import { FoodItem } from '../types';
import { useCart } from '../context/CartContext';
import { TasteRatingBadge } from './TasteRating';

interface FoodDetailModalProps {
  item: FoodItem | null;
  onClose: () => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const { addToCart, getItemQuantity } = useCart();
  const [modalQty, setModalQty] = useState(1);

  const price = item.discount_price && item.discount_price > 0 ? item.discount_price : item.price;
  const originalPrice = item.discount_price && item.discount_price > 0 ? item.price : null;

  const handleAdd = () => {
    addToCart(item, modalQty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors backdrop-blur-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on image */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase backdrop-blur-md flex items-center gap-1.5 ${
              item.is_veg ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
            }`}>
              <span className={`w-2 h-2 rounded-full ${item.is_veg ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
              {item.is_veg ? 'Pure Veg' : 'Non-Veg'}
            </span>
            {item.is_bestseller === 1 && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase bg-amber-500/90 text-white backdrop-blur-md flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-white" /> Bestseller
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-xs uppercase tracking-wider text-orange-300 font-bold">
              {item.category_name || 'Chef Specialty'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mt-0.5">
              {item.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Specific Taste Rating and Attributes bar */}
          <div className="flex flex-wrap items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            {/* Specific Emoji Taste Rating Badge */}
            <TasteRatingBadge rating={item.rating || 4.8} size="md" showLabel={true} />

            {item.preparation_time && (
              <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-medium border border-slate-200/60 dark:border-slate-700">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Prep: {item.preparation_time}</span>
              </div>
            )}
            {item.calories && (
              <div className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-medium border border-slate-200/60 dark:border-slate-700">
                🔥 {item.calories} kcal
              </div>
            )}
          </div>

          {/* Flavor Notes Tagged with Emojis */}
          <div className="bg-orange-50/60 dark:bg-orange-950/30 p-3.5 rounded-2xl border border-orange-100 dark:border-orange-900/40">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-orange-800 dark:text-orange-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Artisanal Taste Profile</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold flex items-center gap-1">
                🤤 Slow Dum Marinated
              </span>
              <span className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold flex items-center gap-1">
                🌶️ Authentic Spiced
              </span>
              <span className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold flex items-center gap-1">
                🧈 Pure Desi Ghee
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              About this delicacy
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Hygiene Guarantee */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Fresh & Hygenic Packaging</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Packed in premium tamper-proof food-grade containers</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                ₹{price * modalQty}
              </span>
              {originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{originalPrice * modalQty}
                </span>
              )}
            </div>
          </div>

          {/* Quantity selector & Add Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-2xs">
              <button
                onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-7 text-center font-bold text-sm text-slate-800 dark:text-white">{modalQty}</span>
              <button
                onClick={() => setModalQty(modalQty + 1)}
                className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-orange-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
