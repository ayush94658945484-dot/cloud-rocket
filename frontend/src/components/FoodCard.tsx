import React from 'react';
import { Plus, Minus, Clock, Flame, Sparkles } from 'lucide-react';
import { FoodItem } from '../types';
import { useCart } from '../context/CartContext';
import { TasteRatingBadge } from './TasteRating';

interface FoodCardProps {
  item: FoodItem;
  onQuickView?: (item: FoodItem) => void;
  onCustomize?: (item: FoodItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, onQuickView, onCustomize }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(item.id);

  const price = item.discount_price && item.discount_price > 0 ? item.discount_price : item.price;
  const originalPrice = item.discount_price && item.discount_price > 0 ? item.price : null;
  const discountPercent = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative">
      
      {/* Food Image Container */}
      <div 
        className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-pointer"
        onClick={() => onQuickView && onQuickView(item)}
      >
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity"></div>

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
          <span className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center p-0.5 ${
            item.is_veg ? 'border-emerald-600' : 'border-rose-600'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${item.is_veg ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
          </span>
          <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
            item.is_veg ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
          }`}>
            {item.is_veg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>

        {/* Bestseller Badge */}
        {item.is_bestseller === 1 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 tracking-wider">
            <Flame className="w-3 h-3 fill-white" /> Bestseller
          </div>
        )}

        {/* Prep Time & Calories in bottom of image */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold drop-shadow-md">
          {item.preparation_time && (
            <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px]">
              <Clock className="w-3 h-3 text-orange-300" /> {item.preparation_time}
            </span>
          )}
          {item.calories && (
            <span className="bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] text-amber-200">
              {item.calories} kcal
            </span>
          )}
        </div>
      </div>

      {/* Food Details Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Specific Taste Rating Icon Badge with Emoji */}
          <div className="flex items-center gap-2 mb-1.5">
            <TasteRatingBadge 
              rating={item.rating || 4.8} 
              size="sm" 
              showLabel={true}
              onClick={() => onQuickView && onQuickView(item)}
            />
            <span className="text-[11px] text-slate-400 font-medium">
              ({item.reviews_count || 24}+ reviews)
            </span>
          </div>

          {/* Dish Name */}
          <h3 
            onClick={() => onQuickView && onQuickView(item)}
            className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors cursor-pointer line-clamp-1 leading-snug"
          >
            {item.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed font-normal">
            {item.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                ₹{price}
              </span>
              {originalPrice && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  ₹{originalPrice}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded-md">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Actions: Customize + Add to Cart */}
          <div className="flex items-center gap-1.5">
            {onCustomize && item.is_available === 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCustomize(item);
                }}
                className="flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 border border-amber-300/60 dark:border-amber-500/40 px-2 py-1.5 rounded-xl transition-all cursor-pointer"
                title="3D Food Customizer (Spice, Portions, Add-ons)"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span className="hidden sm:inline">Customize</span>
              </button>
            )}

            {item.is_available === 0 ? (
              <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                Sold Out
              </span>
            ) : quantity > 0 ? (
              <div className="flex items-center gap-2 bg-orange-600 text-white rounded-xl px-2 py-1 shadow-sm font-bold text-sm">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(item.id, -1);
                  }}
                  className="w-6 h-6 flex items-center justify-center hover:bg-orange-700 rounded-lg transition-colors cursor-pointer"
                  title="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-4 text-center font-black text-xs">{quantity}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(item.id, 1);
                  }}
                  className="w-6 h-6 flex items-center justify-center hover:bg-orange-700 rounded-lg transition-colors cursor-pointer"
                  title="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(item);
                }}
                className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/60 hover:bg-orange-600 text-orange-700 dark:text-orange-300 hover:text-white px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm border border-orange-200 dark:border-orange-800 hover:border-orange-600 transition-all shadow-2xs active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
