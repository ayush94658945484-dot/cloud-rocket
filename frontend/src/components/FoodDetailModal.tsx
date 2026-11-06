import React, { useState } from 'react';
import { X, Star, Clock, Flame, ShoppingBag, Plus, Minus, ShieldCheck } from 'lucide-react';
import { FoodItem } from '../types';
import { useCart } from '../context/CartContext';

interface FoodDetailModalProps {
  item: FoodItem | null;
  onClose: () => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  const [modalQty, setModalQty] = useState(1);
  const cartQty = getItemQuantity(item.id);

  const price = item.discount_price && item.discount_price > 0 ? item.discount_price : item.price;
  const originalPrice = item.discount_price && item.discount_price > 0 ? item.price : null;

  const handleAdd = () => {
    addToCart(item, modalQty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
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
          {/* Attributes bar */}
          <div className="flex items-center gap-4 py-2 border-b border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-lg">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{item.rating || 4.8} / 5.0</span>
            </div>
            {item.preparation_time && (
              <div className="flex items-center gap-1 text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg font-medium">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Prep: {item.preparation_time}</span>
              </div>
            )}
            {item.calories && (
              <div className="text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg font-medium">
                🔥 {item.calories} kcal
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              About This Dish
            </h4>
            <p className="text-slate-700 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Hygiene Guarantee */}
          <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-100 flex items-center gap-3 text-xs text-slate-700">
            <ShieldCheck className="w-5 h-5 text-orange-600 flex-shrink-0" />
            <span>Cooked fresh to order in a temperature-controlled sterile cloud kitchen suite with tamper-evident packaging.</span>
          </div>
        </div>

        {/* Modal Footer / Cart Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Total Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
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
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
              <button
                onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-7 text-center font-bold text-sm text-slate-800">{modalQty}</span>
              <button
                onClick={() => setModalQty(modalQty + 1)}
                className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
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

