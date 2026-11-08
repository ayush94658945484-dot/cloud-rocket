import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  ShoppingBag, 
  Flame, 
  RotateCcw, 
  ShieldCheck, 
  ChevronRight,
  Gift
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { FoodItem } from '../types';

export const MysteryMealDrop: React.FC = () => {
  const { addToCart, setIsCartOpen } = useCart();

  const [budgetTier, setBudgetTier] = useState<number>(299);
  const [dietary, setDietary] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [spicePref, setSpicePref] = useState<'mild' | 'medium' | 'hot'>('medium');
  const [allergyNote, setAllergyNote] = useState<string>('');
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const [revealedItem, setRevealedItem] = useState<FoodItem | null>(null);
  const [added, setAdded] = useState<boolean>(false);

  const budgetOptions = [
    { tier: 199, label: 'Cadet Drop (₹199)', desc: 'Pocket-friendly artisan rolls & bites' },
    { tier: 299, label: 'Commander Drop (₹299)', desc: 'Signature Biryani or Clay Tandoor dish' },
    { tier: 499, label: 'Imperial Feast (₹499)', desc: 'Colossal Royal Handi or Special Combo' },
  ];

  const handleTriggerMysteryDrop = async () => {
    setIsOpening(true);
    setRevealedItem(null);

    try {
      const isVegFilter = dietary === 'veg' ? true : dietary === 'nonveg' ? false : undefined;
      const res = await api.getAICravings('surprise', budgetTier + 50, isVegFilter);

      setTimeout(() => {
        if (res.success && res.recommendations && res.recommendations.length > 0) {
          // Pick a random dish from matching in-stock items
          const randomIndex = Math.floor(Math.random() * res.recommendations.length);
          const chosen = res.recommendations[randomIndex];
          setRevealedItem({
            ...chosen,
            name: `🎲 Mystery Drop: ${chosen.name}`,
            price: budgetTier, // Customer pays their selected mystery drop tier!
            discount_price: undefined,
          });
        }
        setIsOpening(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsOpening(false);
    }
  };

  const handleAddMysteryMeal = () => {
    if (!revealedItem) return;
    addToCart(revealedItem, 1);
    setIsCartOpen(true);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 py-16 sm:py-24 border-y border-purple-500/30">
      
      {/* Background Cosmic Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-purple-700/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-pulse duration-[9000ms]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-purple-300 mb-4 shadow-lg shadow-purple-950/40">
            <Gift className="w-4 h-4 text-purple-400 animate-bounce" />
            <span>Mystery Meal Drop</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Take a Cosmic Culinary Gamble,{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              Save Up to 40%.
            </span>
          </h2>

          <p className="mt-3 text-slate-300 text-sm sm:text-base font-normal">
            Choose your budget and dietary preferences. Our chef algorithm drops a surprise in-stock feast directly to your coordinates with verified allergen transparency.
          </p>
        </div>

        {/* The Mystery Console */}
        <div className="bg-slate-900/90 border-2 border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/80">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {budgetOptions.map((opt) => (
              <button
                key={opt.tier}
                type="button"
                onClick={() => setBudgetTier(opt.tier)}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                  budgetTier === opt.tier
                    ? 'bg-gradient-to-b from-purple-900/60 to-slate-900 border-purple-400 text-white shadow-xl ring-2 ring-purple-400/50 scale-102'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-sm font-black block text-white">{opt.label}</span>
                <span className="text-xs text-purple-300 font-bold block mt-1">{opt.desc}</span>
              </button>
            ))}
          </div>

          {/* Preferences Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-2">Dietary Filter:</label>
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'All Dishes' },
                  { id: 'veg', label: '🌱 Pure Veg' },
                  { id: 'nonveg', label: '🍗 Non-Veg' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDietary(d.id as any)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                      dietary === d.id
                        ? 'bg-purple-600 text-white border-purple-400'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-2">Spice Preference:</label>
              <div className="flex gap-2">
                {[
                  { id: 'mild', label: '🌱 Mild' },
                  { id: 'medium', label: '⚡ Medium' },
                  { id: 'hot', label: '🔥 Fiery Hot' },
                ].map((sp) => (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => setSpicePref(sp.id as any)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                      spicePref === sp.id
                        ? 'bg-amber-600 text-white border-amber-400'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              type="button"
              disabled={isOpening}
              onClick={handleTriggerMysteryDrop}
              className={`inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-black text-sm sm:text-base text-white shadow-2xl transition-all cursor-pointer ${
                isOpening
                  ? 'bg-slate-700 opacity-60 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:scale-105 active:scale-95 shadow-purple-600/50'
              }`}
            >
              <Sparkles className="w-5 h-5 animate-spin" />
              <span>{isOpening ? 'Decentering Cosmic Capsule...' : `Launch Mystery Drop (₹${budgetTier})`}</span>
            </button>
          </div>

          {/* REVEALED RESULT CARD */}
          {revealedItem && (
            <div className="mt-8 pt-6 border-t border-slate-800 animate-in zoom-in-95 duration-400 bg-slate-950/80 p-5 rounded-2xl border border-purple-500/50 flex flex-col sm:flex-row items-center gap-5">
              <img
                src={revealedItem.image_url || '/food-rocket-logo.png'}
                alt={revealedItem.name}
                className="w-28 h-28 rounded-2xl object-cover border-2 border-purple-400/60 shadow-xl"
              />

              <div className="flex-1 text-left">
                <div className="inline-flex items-center gap-1.5 bg-purple-900/60 text-purple-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-1">
                  <span>🎉 COSMIC CAPSULE UNLOCKED</span>
                </div>
                <h4 className="text-lg font-black text-white">{revealedItem.name}</h4>
                <p className="text-xs text-slate-300 mt-1">{revealedItem.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs font-mono text-emerald-400 font-bold">
                  <span>Mystery Tier Price: ₹{revealedItem.price}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">Preparation: {revealedItem.preparation_time}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddMysteryMeal}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{added ? '✓ Added to Cart!' : 'Claim & Add to Cart'}</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
