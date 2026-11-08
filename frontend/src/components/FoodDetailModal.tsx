import React, { useState } from 'react';
import { X, Clock, Flame, ShoppingBag, Plus, Minus, ShieldCheck, Sparkles } from 'lucide-react';
import { FoodItem } from '../types';
import { useCart } from '../context/CartContext';
import { TasteRatingBadge } from './TasteRating';

interface FoodDetailModalProps {
  item: FoodItem | null;
  onClose: () => void;
  onCustomize?: (item: FoodItem) => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ item, onClose, onCustomize }) => {
  if (!item) return null;

  const { addToCart } = useCart();
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
            <h2 className="text-xl sm:text-2xl font-black">{item.name}</h2>
            <div className="flex items-center gap-4 mt-1 text-xs text-slate-300">
              {item.preparation_time && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-orange-400" /> Prep: {item.preparation_time}
                </span>
              )}
              {item.calories && (
                <span className="flex items-center gap-1 text-amber-300">
                  <Flame className="w-3.5 h-3.5" /> {item.calories} kcal
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Specific Taste Rating Icon Badge with Emoji */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <TasteRatingBadge 
              rating={item.rating || 4.8} 
              size="md" 
              showLabel={true} 
            />
            <span className="text-xs text-slate-400">
              Verified Gourmet Cloud Kitchen Item
            </span>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Description</h4>
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
              <p className="text-xs font-bold text-slate-900 dark:text-white">Fresh & Hygienic Packaging</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Packed in premium tamper-proof food-grade containers</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3">
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

          {/* Quantity selector & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onCustomize && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onCustomize(item);
                }}
                className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
                title="3D Customize Portion, Spices & Add-ons"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Customize</span>
              </button>
            )}

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
