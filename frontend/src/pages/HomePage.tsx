import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Flame, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Tag, 
  Check, 
  ShoppingBag,
  Award,
  Layers,
  ChefHat,
  Heart,
  Sliders,
  Bike,
  Leaf
} from 'lucide-react';
import { FoodItem, Category } from '../types';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { useMode } from '../context/ModeContext';
import { FoodCard } from '../components/FoodCard';
import { ReviewSection } from '../components/ReviewSection';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
  onQuickView: (item: FoodItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onQuickView }) => {
  const { settings } = useSettings();
  const { orderMode, dietaryMode, themeMode, openModeModal } = useMode();
  const [categories, setCategories] = useState<Category[]>([]);
  const [bestsellers, setBestsellers] = useState<FoodItem[]>([]);
  const [featured, setFeatured] = useState<FoodItem[]>([]);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await api.getCategories();
        if (catRes.success) setCategories(catRes.categories);

        const foodRes = await api.getFoodItems({ bestseller: true });
        if (foodRes.success) setBestsellers(foodRes.items.slice(0, 8));

        const featRes = await api.getFoodItems({ featured: true });
        if (featRes.success) setFeatured(featRes.items.slice(0, 4));
      } catch (err) {
        console.error('Error fetching home data:', err);
      }
    };
    fetchData();
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center justify-center overflow-hidden bg-slate-950 text-white">
        {/* Background Food Photography with Dark Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=85"
            alt="Royal Gourmet Feast"
            className="w-full h-full object-cover object-center opacity-35 scale-105 animate-in fade-in zoom-in-105 duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/50"></div>
          <div className="absolute inset-0 bg-radial from-orange-600/15 via-transparent to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          
          {/* Top Brand Pill */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-amber-300 mb-6 shadow-lg shadow-orange-900/20">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span>Premium Cloud Kitchen Experience</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Artisanal Flavors,{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Delivered Hot & Fresh
            </span>{' '}
            in 30 Mins.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Authentic slow-dum biryanis, clay-tandoor smoked tikkas, and rich heritage gravies crafted by master chefs exclusively for doorstep delivery.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('menu')}
              className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-sm sm:text-base px-8 py-4 rounded-2xl shadow-xl shadow-orange-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Explore Menu & Order</span>
            </button>

            <button
              onClick={() => onNavigate('offers')}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md font-bold text-sm sm:text-base px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Tag className="w-5 h-5 text-amber-400" />
              <span>Today's Special Offers (50% OFF)</span>
            </button>
          </div>

          {/* Home Page Mode Switcher Button (Opens Popup) */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={openModeModal}
              className="group inline-flex items-center gap-3 bg-slate-900/90 hover:bg-slate-900 text-white border border-amber-500/50 hover:border-amber-400 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl shadow-orange-950/50 transition-all cursor-pointer hover:scale-102"
              title="Click to change Delivery Mode, Pure Veg, or Theme"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md">
                <Sliders className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                    Active Mode:
                  </span>
                  <span className="text-xs font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                    {orderMode === 'delivery' ? '🛵 Express Delivery' : '🥡 Kitchen Pickup'}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                    {dietaryMode === 'veg' ? '🟢 Pure Veg Only' : '🍖 All Delicacies'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Click here to switch fulfillment, pure veg, or dark mode
                </p>
              </div>
              <span className="ml-1 text-xs font-black bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3.5 py-1.5 rounded-xl shadow-sm group-hover:from-orange-600 group-hover:to-amber-600 transition-all flex items-center gap-1">
                <span>Change Mode</span>
                <span className="text-amber-200">⚡</span>
              </span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">30 Min Delivery</p>
                <p className="text-[11px] text-slate-400">Guaranteed hot arrival</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">100% Tamper Proof</p>
                <p className="text-[11px] text-slate-400">Sterilized sealing</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Master Chefs</p>
                <p className="text-[11px] text-slate-400">Authentic royal recipes</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">WhatsApp Orders</p>
                <p className="text-[11px] text-slate-400">Direct 1-tap ordering</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR FOOD CATEGORIES (8 Categories Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-orange-600 font-extrabold text-xs uppercase tracking-widest bg-orange-100 px-3 py-1 rounded-full">
              Explore Our Kitchen
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              Popular Food Categories
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Select a category to browse our handcrafted selections
            </p>
          </div>

          <button
            onClick={() => onNavigate('menu')}
            className="flex items-center gap-1.5 text-orange-600 font-bold text-sm hover:underline self-start sm:self-auto cursor-pointer"
          >
            <span>View Full Menu</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('menu', { category: cat.slug })}
              className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs hover:shadow-lg hover:border-orange-200 transition-all cursor-pointer group text-center flex flex-col items-center justify-between"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2.5 p-1 bg-gradient-to-tr from-amber-400 to-orange-500 shadow-xs group-hover:scale-105 transition-transform">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight">
                  {cat.name}
                </h4>
                <span className="text-[10px] text-slate-400 font-medium">
                  {cat.item_count || 'Featured'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PROMO OFFER COUPONS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 hidden lg:block"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center lg:text-left">
              <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-amber-200">
                ⚡ Limited Time Cloud Fest
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white">
                Get Flat 50% OFF Up To ₹100!
              </h3>
              <p className="text-slate-100 text-xs sm:text-sm max-w-lg">
                Taste the rocket-fast flavor difference with our authentic dum biryanis and gourmet curries. Applicable on your first order.
              </p>
            </div>

            {/* Promo Code Cards */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-3 text-center min-w-[140px]">
                <span className="text-[10px] uppercase text-amber-200 font-bold block">First Order</span>
                <span className="text-lg font-black tracking-widest text-white block">WELCOME50</span>
                <button
                  onClick={() => copyCode('WELCOME50')}
                  className="mt-1 text-[11px] font-bold bg-white text-orange-700 hover:bg-orange-50 px-3 py-1 rounded-lg transition-colors cursor-pointer w-full"
                >
                  {copiedCoupon === 'WELCOME50' ? 'Copied! ✓' : 'Copy Code'}
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-3 text-center min-w-[140px]">
                <span className="text-[10px] uppercase text-amber-200 font-bold block">Orders Above ₹499</span>
                <span className="text-lg font-black tracking-widest text-white block">FEAST100</span>
                <button
                  onClick={() => copyCode('FEAST100')}
                  className="mt-1 text-[11px] font-bold bg-white text-orange-700 hover:bg-orange-50 px-3 py-1 rounded-lg transition-colors cursor-pointer w-full"
                >
                  {copiedCoupon === 'FEAST100' ? 'Copied! ✓' : 'Copy Code'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHEF'S BESTSELLING DISHES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-orange-600 font-extrabold text-xs uppercase tracking-widest bg-orange-100 px-3 py-1 rounded-full">
              Crowd Favorites
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              Today's Most Ordered Dishes
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Cooked fresh in small batches to preserve royal flavors
            </p>
          </div>

          <button
            onClick={() => onNavigate('menu')}
            className="flex items-center gap-1.5 text-orange-600 font-bold text-sm hover:underline cursor-pointer"
          >
            <span>See All Bestsellers</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((dish) => (
            <FoodCard key={dish.id} item={dish} onQuickView={onQuickView} />
          ))}
        </div>
      </section>

      {/* 5. WHY CHOOSE OUR CLOUD KITCHEN */}
      <section className="bg-slate-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-amber-400 font-extrabold text-xs uppercase tracking-widest bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
              The Cloud Culinary Edge
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3">
              Why Foodies Prefer Cloud Rocket
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Unlike traditional dine-in restaurants, 100% of our focus, equipment, and packaging is engineered solely for peak delivery freshness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <ChefHat className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Zero Compromise Ingredients</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                We use organic cold-pressed oils, aged Himalayan basmati, hand-ground Kashmiri chilies, and farm-fresh paneer & poultry sourced daily.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Hospital-Grade Sterilization</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Continuous HEPA air filtration, UV-C packaging sanitization, and staff temperature logs ensure your meals are cooked with pristine safety.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Insulated Hot Thermal Box</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Special three-layer corrugated thermal containers lock in piping-hot steam, crispiness, and moisture all the way from our tandoor to your table.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED REVIEWS & RATINGS */}
      <ReviewSection />

      {/* 7. INSTAGRAM & SOCIAL MEDIA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div>
          <span className="text-orange-600 font-extrabold text-xs uppercase tracking-widest bg-orange-100 px-3 py-1 rounded-full">
            @CloudRocketKitchen
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
            Follow Our Culinary Journey on Instagram
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Tag us in your food stories to get featured & win weekly feast vouchers!
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl overflow-hidden aspect-square group relative">
            <img 
              src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80" 
              alt="Biryani Insta" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
              #DumBiryaniPerfection
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-square group relative">
            <img 
              src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=500&q=80" 
              alt="Tandoori Insta" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
              #MalaiTikkaLove
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-square group relative">
            <img 
              src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80" 
              alt="Dal Makhani Insta" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
              #DalBukhara36Hours
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-square group relative">
            <img 
              src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=500&q=80" 
              alt="Dessert Insta" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
              #SaffronRasmalai
            </div>
          </div>
        </div>
      </section>

      {/* Floating Home Mode Switcher Pill */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          type="button"
          onClick={openModeModal}
          className="flex items-center gap-2.5 bg-slate-900/95 dark:bg-slate-800/95 hover:bg-black text-white border border-amber-500/40 backdrop-blur-md py-2.5 px-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Change Dining & Order Mode"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
          </span>
          <Sliders className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
          <span className="text-xs font-bold">
            {orderMode === 'delivery' ? '🛵 Delivery' : '🥡 Pickup'} • {dietaryMode === 'veg' ? '🟢 Veg' : '🍖 All'}
          </span>
          <span className="text-[10px] uppercase font-black bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
            Mode
          </span>
        </button>
      </div>
    </div>
  );
};

