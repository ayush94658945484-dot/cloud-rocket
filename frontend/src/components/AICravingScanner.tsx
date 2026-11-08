import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  ShoppingBag, 
  Sliders, 
  RotateCcw, 
  Check, 
  ChevronRight,
  Zap,
  Tag
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { FoodItem } from '../types';

interface AICravingScannerProps {
  onQuickView?: (item: FoodItem) => void;
  onCustomize?: (item: FoodItem) => void;
  onNavigate?: (page: string, params?: any) => void;
}

export const AICravingScanner: React.FC<AICravingScannerProps> = ({ 
  onQuickView, 
  onCustomize,
  onNavigate 
}) => {
  const { addToCart, setIsCartOpen } = useCart();
  
  const [selectedCraving, setSelectedCraving] = useState<string>('spicy');
  const [selectedBudget, setSelectedBudget] = useState<number | undefined>(undefined);
  const [isVegOnly, setIsVegOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [addedItemId, setAddedItemId] = useState<number | null>(null);

  const cravingOptions = [
    { id: 'spicy', label: 'Something Spicy', icon: '🌶️', desc: 'Fiery tandoor spices & heat' },
    { id: 'crispy', label: 'Something Crispy', icon: '✨', desc: 'Clay tandoor blistered crunch' },
    { id: 'cheesy', label: 'Something Cheesy', icon: '🧀', desc: 'Melted cheese & butter gravies' },
    { id: 'affordable', label: 'Pocket-Friendly', icon: '💰', desc: 'Gourmet delicacies under ₹250' },
    { id: 'filling', label: 'Heavy & Filling', icon: '🍖', desc: 'Royal Biryanis & Feast Combos' },
    { id: 'surprise', label: 'Surprise Me!', icon: '🎲', desc: 'Cosmic chef recommendation' },
  ];

  const budgetOptions = [
    { label: 'Any Budget', value: undefined },
    { label: 'Under ₹250', value: 250 },
    { label: 'Under ₹400', value: 400 },
    { label: 'Under ₹750', value: 750 },
  ];

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await api.getAICravings(selectedCraving, selectedBudget, isVegOnly);
      if (res.success && res.recommendations) {
        setMatches(res.recommendations);
      }
    } catch (err) {
      console.error('Failed to scan cravings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [selectedCraving, selectedBudget, isVegOnly]);

  const handleAddToCart = (item: any) => {
    addToCart(item, 1);
    setAddedItemId(item.id);
    setIsCartOpen(true);
    setTimeout(() => setAddedItemId(null), 2500);
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 py-16 sm:py-20 border-y border-amber-500/20">
      {/* Background Cosmic Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/2 left-10 w-80 h-80 bg-orange-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl animate-pulse duration-[8000ms]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-amber-300 mb-4 shadow-lg shadow-orange-950/40">
            <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>AI Craving Scanner 2.0</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Tell Our AI What You Crave,{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              We Match It Instantly.
            </span>
          </h2>

          <p className="mt-3 text-slate-300 text-sm sm:text-base font-normal">
            Neural taste-mapping engine scanning live 1,000°F clay tandoor items, spice profiles, and verified availability.
          </p>
        </div>

        {/* Craving Selection Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {cravingOptions.map((opt) => {
            const isSelected = selectedCraving === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedCraving(opt.id)}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all cursor-pointer text-center group ${
                  isSelected
                    ? 'bg-gradient-to-b from-orange-600 to-amber-700 text-white border-amber-400 shadow-xl shadow-orange-950/80 scale-102 ring-2 ring-amber-400/50'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-orange-500/40'
                }`}
              >
                <span className="text-2xl mb-1 group-hover:scale-120 transition-transform">{opt.icon}</span>
                <span className="text-xs font-black">{opt.label}</span>
                <span className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                  {opt.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Budget & Diet Secondary Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800 mb-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-2">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Budget Cap:</span>
            </span>
            {budgetOptions.map((b) => (
              <button
                key={b.label}
                type="button"
                onClick={() => setSelectedBudget(b.value)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                  selectedBudget === b.value
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsVegOnly(!isVegOnly)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                isVegOnly
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isVegOnly ? 'bg-emerald-400' : 'bg-slate-400'}`} />
              <span>{isVegOnly ? 'Pure Veg Only' : 'Show All Delicacies'}</span>
            </button>
          </div>
        </div>

        {/* Real Matched Dishes Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mb-4" />
            <p className="text-amber-300 font-black text-sm tracking-widest uppercase">
              AI Taste-Mapping in Progress...
            </p>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
            <p className="text-slate-400 text-sm">No dishes matched this exact filter combination.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedBudget(undefined);
                setIsVegOnly(false);
              }}
              className="mt-4 text-xs font-bold text-amber-400 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((item) => (
              <div
                key={item.id}
                className="group relative bg-slate-900/90 hover:bg-slate-850 rounded-3xl overflow-hidden border border-slate-800 hover:border-orange-500/50 shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image & Match Pill */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <img
                    src={item.image_url || '/food-rocket-logo.png'}
                    alt={item.name}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

                  {/* AI Match Score Tag */}
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/50 text-amber-300 font-mono text-[11px] font-black shadow-lg">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{item.ai_score}% Match</span>
                  </div>

                  {/* Spice Badge */}
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-extrabold text-white border border-white/10">
                    {item.spice_level}
                  </div>

                  {/* Veg Tag */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-slate-950/90 px-2 py-0.5 rounded-md text-[10px] font-bold">
                    <span className={`w-2 h-2 rounded-full ${item.is_veg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span className="text-slate-300">{item.is_veg ? 'Pure Veg' : 'Non-Veg'}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* AI Reasoning Pill */}
                    <div className="mt-3 p-2.5 rounded-xl bg-orange-950/40 border border-orange-500/20 text-[11px] text-amber-200/90 flex items-start gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{item.ai_match_reason}</span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-white">
                          ₹{item.discount_price && item.discount_price > 0 ? item.discount_price : item.price}
                        </span>
                        {item.discount_price && item.discount_price > 0 && (
                          <span className="text-xs text-slate-500 line-through">₹{item.price}</span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block">{item.preparation_time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {onCustomize && (
                        <button
                          type="button"
                          onClick={() => onCustomize(item)}
                          className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-extrabold text-xs px-3 py-2.5 rounded-xl border border-slate-700 hover:border-amber-400 transition-all cursor-pointer"
                          title="Customize extra cheese, spice, and toppings"
                        >
                          Customize
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-orange-600/30 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{addedItemId === item.id ? 'Added!' : 'Add to Cart'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
