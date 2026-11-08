import React, { useState } from 'react';
import { 
  X, 
  Flame, 
  Check, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles, 
  Layers, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { FoodItem } from '../types';
import { useCart } from '../context/CartContext';

interface FoodCustomizerModalProps {
  item: FoodItem | null;
  onClose: () => void;
}

export const FoodCustomizerModal: React.FC<FoodCustomizerModalProps> = ({ item, onClose }) => {
  const { addToCart, setIsCartOpen } = useCart();

  if (!item) return null;

  // Customization States
  const [portion, setPortion] = useState<'regular' | 'large'>('regular');
  const [extraCheese, setExtraCheese] = useState<boolean>(false);
  const [extraProtein, setExtraProtein] = useState<boolean>(false);
  const [spiceLevel, setSpiceLevel] = useState<number>(3); // 1 to 5
  const [selectedSauces, setSelectedSauces] = useState<string[]>(['Mint Cilantro Dip']);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);

  // Price Calculation
  const basePrice = item.discount_price && item.discount_price > 0 ? item.discount_price : item.price;
  const portionPrice = portion === 'large' ? 90 : 0;
  const cheesePrice = extraCheese ? 40 : 0;
  const proteinPrice = extraProtein ? 60 : 0;
  const unitPrice = basePrice + portionPrice + cheesePrice + proteinPrice;
  const totalPrice = unitPrice * quantity;

  const saucesList = [
    'Mint Cilantro Dip',
    'Smoked Garlic Aioli',
    'Ghost Pepper Fiery Dip (+₹20)',
    'Tandoori Spiced Mayo',
  ];

  const removableList = [
    'Raw Sliced Onions',
    'Fresh Coriander Leaves',
    'Green Chilies',
    'Extra Black Pepper',
  ];

  const toggleSauce = (s: string) => {
    setSelectedSauces((prev) => 
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const toggleRemoved = (ing: string) => {
    setRemovedIngredients((prev) =>
      prev.includes(ing) ? prev.filter((x) => x !== ing) : [...prev, ing]
    );
  };

  const handleConfirmAddToCart = () => {
    const customSummary = [
      portion === 'large' ? 'Grand Portion' : 'Regular Portion',
      extraCheese ? 'Extra Melted Cheese (+₹40)' : null,
      extraProtein ? `${item.is_veg ? 'Extra Paneer' : 'Extra Chicken'} (+₹60)` : null,
      `Spice: Level ${spiceLevel}/5`,
      selectedSauces.length > 0 ? `Sauces: ${selectedSauces.join(', ')}` : null,
      removedIngredients.length > 0 ? `Exclude: ${removedIngredients.join(', ')}` : null,
    ].filter(Boolean).join(' • ');

    const customizedItem: FoodItem = {
      ...item,
      name: `${item.name} (Chef Customized)`,
      price: unitPrice,
      discount_price: undefined,
      description: `${item.description} [${customSummary}]`,
    };

    addToCart(customizedItem, quantity);
    setIsCartOpen(true);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/50 rounded-3xl overflow-hidden shadow-2xl shadow-orange-950/80 my-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-orange-600/30 text-amber-400 flex items-center justify-center text-sm">
              ⚡
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                3D Food Customizer Studio
              </h3>
              <p className="text-xs text-slate-400">Tailor toppings, portion & spice index</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">
          
          {/* Dish Header Info */}
          <div className="flex gap-4 items-center bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <img
              src={item.image_url || '/food-rocket-logo.png'}
              alt={item.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h4 className="text-base font-black text-white">{item.name}</h4>
              <p className="text-xs text-amber-400 font-extrabold mt-0.5">Base Price: ₹{basePrice}</p>
            </div>
            {/* Real-time Dynamic 3D Topping Indicator */}
            <div className="text-right text-xs font-mono">
              <span className="text-slate-400 block text-[10px]">LIVE CUSTOM PRICE</span>
              <span className="text-xl font-black text-emerald-400">₹{unitPrice}</span>
            </div>
          </div>

          {/* 1. Portion Size */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-300 block mb-2.5">
              1. Choose Portion Size
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPortion('regular')}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  portion === 'regular'
                    ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black">Regular Portion</span>
                  <span className="text-xs font-bold text-slate-400">+₹0</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Standard 1-person serving</p>
              </button>

              <button
                type="button"
                onClick={() => setPortion('large')}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  portion === 'large'
                    ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-amber-300">Grand Feast Portion</span>
                  <span className="text-xs font-bold text-amber-400">+₹90</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">+50% extra volume (Serves 2)</p>
              </button>
            </div>
          </div>

          {/* 2. Extra Gourmet Toppings */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-300 block mb-2.5">
              2. Add Deluxe Toppings
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExtraCheese(!extraCheese)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  extraCheese
                    ? 'bg-orange-500/20 border-orange-400 text-white shadow-md'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🧀</span>
                  <span className="text-xs font-bold">Double Melted Cheese</span>
                </div>
                <span className="text-xs font-extrabold text-amber-400">+₹40</span>
              </button>

              <button
                type="button"
                onClick={() => setExtraProtein(!extraProtein)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  extraProtein
                    ? 'bg-orange-500/20 border-orange-400 text-white shadow-md'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🍗</span>
                  <span className="text-xs font-bold">{item.is_veg ? 'Extra Charred Paneer' : 'Extra Tandoori Chicken'}</span>
                </div>
                <span className="text-xs font-extrabold text-amber-400">+₹60</span>
              </button>
            </div>
          </div>

          {/* 3. Spice Level Slider (1 - 5) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                <span>3. Clay Tandoor Spice Intensity</span>
              </label>
              <span className="text-xs font-bold text-amber-300">
                {spiceLevel === 1 && '🌱 Level 1: Gentle Mild'}
                {spiceLevel === 2 && '✨ Level 2: Subtle Warmth'}
                {spiceLevel === 3 && '⚡ Level 3: Chef Signature Medium'}
                {spiceLevel === 4 && '🔥 Level 4: Fiery Spicy'}
                {spiceLevel === 5 && '💥 Level 5: Volcanic Tandoori Heat'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSpiceLevel(lvl)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    spiceLevel >= lvl
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {lvl} 🔥
                </button>
              ))}
            </div>
          </div>

          {/* 4. Chef Dips & Sauces */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-300 block mb-2.5">
              4. Select Signature Sauces
            </label>
            <div className="grid grid-cols-2 gap-2">
              {saucesList.map((sauce) => {
                const isSelected = selectedSauces.includes(sauce);
                return (
                  <button
                    key={sauce}
                    type="button"
                    onClick={() => toggleSauce(sauce)}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{sauce}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Ingredients to Exclude */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-300 block mb-2">
              5. Ingredients to Remove (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {removableList.map((ing) => {
                const isRemoved = removedIngredients.includes(ing);
                return (
                  <button
                    key={ing}
                    type="button"
                    onClick={() => toggleRemoved(ing)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      isRemoved
                        ? 'bg-red-950/80 border-red-500 text-red-300 line-through'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {ing}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Bottom Checkout Bar */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-sm font-black text-white w-5 text-center">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirmAddToCart}
            className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-xs sm:text-sm py-3 px-6 rounded-2xl shadow-xl shadow-orange-600/40 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{added ? '✓ Added to Cart!' : `Add to Order (Total: ₹${totalPrice})`}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
