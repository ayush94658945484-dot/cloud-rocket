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
  Leaf,
  Star,
  Users,
  Gift,
  Orbit,
  HelpCircle
} from 'lucide-react';
import { FoodItem, Category } from '../types';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { useMode } from '../context/ModeContext';
import { FoodCard } from '../components/FoodCard';
import { ReviewSection } from '../components/ReviewSection';
import { RocketToPlateShowcase } from '../components/RocketToPlateShowcase';
import { AICravingScanner } from '../components/AICravingScanner';
import { FoodGalaxy } from '../components/FoodGalaxy';
import { MysteryMealDrop } from '../components/MysteryMealDrop';
import { BehindTheKitchen } from '../components/BehindTheKitchen';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
  onQuickView: (item: FoodItem) => void;
  onCustomize?: (item: FoodItem) => void;
  onOpenParty?: () => void;
  onOpenPassport?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  onNavigate, 
  onQuickView,
  onCustomize,
  onOpenParty,
  onOpenPassport
}) => {
  const { settings } = useSettings();
  const { orderMode, dietaryMode, themeMode, openModeModal } = useMode();
  const [categories, setCategories] = useState<Category[]>([]);
  const [bestsellers, setBestsellers] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, itemsRes] = await Promise.all([
          api.getCategories(),
          api.getFoodItems({ is_bestseller: 1 }),
        ]);

        if (catsRes.success && catsRes.categories) {
          setCategories(catsRes.categories);
        }

        if (itemsRes.success && itemsRes.items) {
          setBestsellers(itemsRes.items);
        }
      } catch (err) {
        console.error('Error fetching home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. HERO SECTION - CRAVINGS DELIVERED FROM ANOTHER PLANET */}
      <section className="relative overflow-hidden bg-slate-950 min-h-[640px] sm:min-h-[700px] flex items-center justify-center border-b border-amber-500/20">
        {/* Background Image with Deep Obsidian Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=85"
            alt="Food Rocket Futuristic Cloud Kitchen"
            className="w-full h-full object-cover object-center opacity-25 mix-blend-luminosity scale-105 animate-pulse duration-[12000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/70"></div>
          <div className="absolute inset-0 bg-radial from-orange-950/30 via-transparent to-black/80"></div>
        </div>

        {/* Ambient Cosmic Lights */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          
          {/* Food Rocket Brand Emblem */}
          <div className="flex justify-center mb-5">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-slate-900 p-1.5 shadow-2xl shadow-orange-600/40 ring-4 ring-amber-500/60 hover:scale-105 transition-transform duration-300">
              <img 
                src="/food-rocket-logo.png" 
                alt="Food Rocket Logo - Fuel Your Hunger, Fast" 
                className="w-full h-full object-contain rounded-full" 
              />
            </div>
          </div>

          {/* Top Brand Pill */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-red-500/20 border border-orange-500/40 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-amber-300 mb-6 shadow-lg shadow-orange-950/50">
            <span className="text-sm">🚀</span>
            <span>NEXT-GEN CLOUD KITCHEN • FOOD ROCKET EXPRESS</span>
          </div>

          {/* Core User Requirement Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-5xl mx-auto leading-[1.08] uppercase">
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Cravings Delivered From{' '}
            </span>
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent underline decoration-orange-500/40 decoration-wavy">
              Another Planet.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Authentic slow-dum biryanis, 1,000°F clay-tandoor smoked tikkas, and supersonic feast drops crafted by master chefs exclusively for doorstep delivery in 30 minutes.
          </p>

          {/* CTAs: EXPLORE MENU & ORDER NOW */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('menu')}
              className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-sm sm:text-base px-8 py-4 rounded-2xl shadow-xl shadow-orange-600/40 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-orange-400/40 group"
            >
              <ShoppingBag className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
              <span>EXPLORE MENU</span>
              <ChevronRight className="w-4 h-4 text-amber-200" />
            </button>

            <button
              onClick={() => onNavigate('menu')}
              className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black text-sm sm:text-base px-8 py-4 rounded-2xl shadow-xl shadow-red-600/40 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-red-400/40"
            >
              <Flame className="w-5 h-5 text-amber-300 animate-pulse" />
              <span>ORDER NOW</span>
            </button>
          </div>

          {/* Quick Jump & Futuristic Feature Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            
            {/* Mode Switcher */}
            <button
              type="button"
              onClick={openModeModal}
              className="group inline-flex items-center gap-2.5 bg-slate-900/90 hover:bg-slate-900 text-white border border-amber-500/40 hover:border-amber-400 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl transition-all cursor-pointer hover:scale-102"
              title="Change Delivery Mode, Pure Veg, or Theme"
            >
              <Sliders className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
              <span className="text-xs font-bold">
                {orderMode === 'delivery' ? '🛵 Delivery' : '🥡 Pickup'} • {dietaryMode === 'veg' ? '🟢 Veg Only' : '🍖 All Food'}
              </span>
              <span className="text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                Mode
              </span>
            </button>

            {/* Jump to 3D Rocket Blast Chicken Theater */}
            <button
              type="button"
              onClick={() => handleScrollToSection('rocket-blast-theater')}
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-red-950/80 to-slate-900 hover:bg-slate-900 text-white border border-red-500/50 hover:border-red-400 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl transition-all cursor-pointer hover:scale-102"
              title="Experience 3D Rocket-to-Plate Blast"
            >
              <span className="text-sm">🚀</span>
              <span className="text-xs font-bold text-red-200">3D Rocket Blast</span>
              <span className="text-[10px] font-black uppercase bg-red-600 text-white px-2 py-0.5 rounded-full">
                Watch 3D
              </span>
            </button>

            {/* Jump to AI Craving Scanner */}
            <button
              type="button"
              onClick={() => handleScrollToSection('craving-scanner-section')}
              className="group inline-flex items-center gap-2 bg-slate-900/90 hover:bg-slate-900 text-white border border-cyan-500/40 hover:border-cyan-400 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl transition-all cursor-pointer hover:scale-102"
              title="AI Craving Scanner"
            >
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span className="text-xs font-bold text-cyan-200">AI Craving Scanner</span>
              <span className="text-[10px] font-black uppercase bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/40">
                Match
              </span>
            </button>

            {/* Jump to Food Galaxy (Planetary Menu) */}
            <button
              type="button"
              onClick={() => handleScrollToSection('food-galaxy-section')}
              className="group inline-flex items-center gap-2 bg-slate-900/90 hover:bg-slate-900 text-white border border-purple-500/40 hover:border-purple-400 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl transition-all cursor-pointer hover:scale-102"
              title="Explore 3D Food Galaxy Planets"
            >
              <Orbit className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-purple-200">Food Galaxy</span>
              <span className="text-[10px] font-black uppercase bg-purple-950 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/40">
                Planets
              </span>
            </button>

            {/* Food Party (Group Ordering) */}
            {onOpenParty && (
              <button
                type="button"
                onClick={onOpenParty}
                className="group inline-flex items-center gap-2 bg-slate-900/90 hover:bg-slate-900 text-white border border-emerald-500/40 hover:border-emerald-400 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl transition-all cursor-pointer hover:scale-102"
                title="Collaborative Group Ordering"
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-200">Food Party</span>
                <span className="text-[10px] font-black uppercase bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  Group
                </span>
              </button>
            )}

            {/* Food Passport (Rewards & Miles) */}
            {onOpenPassport && (
              <button
                type="button"
                onClick={onOpenPassport}
                className="group inline-flex items-center gap-2 bg-slate-900/90 hover:bg-slate-900 text-white border border-amber-500/40 hover:border-amber-400 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl transition-all cursor-pointer hover:scale-102"
                title="Digital Food Passport & Membership"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-200">Food Passport</span>
                <span className="text-[10px] font-black uppercase bg-amber-950 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40">
                  Miles
                </span>
              </button>
            )}

            {/* Jump to Taste Reviews */}
            <button
              type="button"
              onClick={() => handleScrollToSection('taste-reviews')}
              className="group inline-flex items-center gap-2 bg-slate-900/90 hover:bg-slate-900 text-white border border-orange-500/40 hover:border-orange-400 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl transition-all cursor-pointer hover:scale-102"
              title="Verified Taste Ratings"
            >
              <span className="text-sm">🤤</span>
              <span className="text-xs font-bold text-amber-300">4.9 / 5.0 Taste</span>
              <span className="text-[10px] font-black uppercase bg-orange-600 text-white px-2 py-0.5 rounded-full">
                25k+ Reviews
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
                <p className="text-[11px] text-slate-400">Hologram sterilized seal</p>
              </div>
            </div>

            <div 
              onClick={() => handleScrollToSection('taste-reviews')}
              className="flex items-center gap-3 cursor-pointer group"
              title="Click to view Customer Taste Reviews"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 text-xl group-hover:scale-110 transition-transform">
                🤤
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1">
                  <span>4.9/5 Taste Score</span>
                  <span className="text-[10px] text-amber-400">★</span>
                </p>
                <p className="text-[11px] text-slate-400 group-hover:text-amber-300 transition-colors">25k+ Foodie reviews</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">WhatsApp Orders</p>
                <p className="text-[11px] text-slate-400">Instant 1-tap ordering</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CINEMATIC 3D ROCKET-TO-PLATE CHICKEN BLAST SHOWCASE */}
      <div id="rocket-blast-theater">
        <RocketToPlateShowcase onNavigate={onNavigate} />
      </div>

      {/* 3. AI CRAVING SCANNER - REAL-TIME FOOD MATCHING */}
      <div id="craving-scanner-section">
        <AICravingScanner 
          onQuickView={onQuickView} 
          onCustomize={onCustomize} 
          onNavigate={onNavigate} 
        />
      </div>

      {/* 4. FOOD GALAXY - INTERACTIVE 3D PLANETARY MENU */}
      <div id="food-galaxy-section">
        <FoodGalaxy 
          onQuickView={onQuickView} 
          onCustomize={onCustomize} 
          onNavigate={onNavigate} 
        />
      </div>

      {/* 5. POPULAR FOOD CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-orange-600 dark:text-orange-400 font-extrabold text-xs uppercase tracking-widest bg-orange-100 dark:bg-orange-950/60 px-3 py-1 rounded-full">
              Explore Our Kitchen
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
              Popular Food Categories
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Select a category to browse our handcrafted selections
            </p>
          </div>

          <button
            onClick={() => onNavigate('menu')}
            className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-bold text-sm hover:underline self-start sm:self-auto cursor-pointer"
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
              className="bg-white dark:bg-slate-800 rounded-2xl p-3 border border-slate-100 dark:border-slate-700 shadow-2xs hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-500/50 transition-all cursor-pointer group text-center flex flex-col items-center justify-between"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2.5 p-1 bg-gradient-to-tr from-amber-400 to-orange-500 shadow-xs group-hover:scale-105 transition-transform">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2 leading-tight">
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

      {/* 6. PROMO OFFER COUPONS BANNER */}
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

      {/* 7. CHEF'S BESTSELLING DISHES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-orange-600 dark:text-orange-400 font-extrabold text-xs uppercase tracking-widest bg-orange-100 dark:bg-orange-950/60 px-3 py-1 rounded-full">
              Crowd Favorites
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
              Today's Most Ordered Dishes
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Cooked fresh in small batches with verified foodie taste scores
            </p>
          </div>

          <button
            onClick={() => onNavigate('menu')}
            className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-bold text-sm hover:underline cursor-pointer"
          >
            <span>See All Bestsellers</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((dish) => (
            <FoodCard 
              key={dish.id} 
              item={dish} 
              onQuickView={onQuickView} 
              onCustomize={onCustomize}
            />
          ))}
        </div>
      </section>

      {/* 8. MYSTERY MEAL DROP - SURPRISE ME */}
      <div id="mystery-drop-section">
        <MysteryMealDrop />
      </div>

      {/* 9. BEHIND THE GALACTIC KITCHEN */}
      <BehindTheKitchen />

      {/* 10. VERIFIED REVIEWS & RATINGS WITH EMOJIS */}
      <div id="taste-reviews">
        <ReviewSection />
      </div>

      {/* 11. INSTAGRAM & SOCIAL MEDIA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div>
          <span className="text-orange-600 dark:text-orange-400 font-extrabold text-xs uppercase tracking-widest bg-orange-100 dark:bg-orange-950/60 px-3 py-1 rounded-full">
            @FoodRocketKitchen
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            Follow Our Culinary Journey on Instagram
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Tag us in your food stories to get featured & win weekly feast vouchers!
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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

      {/* Floating Home Controls: Mode Switcher & Taste Reviews */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2">
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

        {/* Floating Quick Taste Reviews Pill */}
        <button
          type="button"
          onClick={() => handleScrollToSection('taste-reviews')}
          className="hidden sm:flex items-center gap-1.5 bg-slate-900/95 dark:bg-slate-800/95 hover:bg-black text-white border border-orange-500/40 backdrop-blur-md py-2.5 px-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="View Taste Reviews with Emojis"
        >
          <span className="text-base group-hover:scale-125 transition-transform">🤤</span>
          <span className="text-xs font-black text-amber-300">4.9</span>
          <span className="text-[10px] uppercase font-bold text-slate-300">Taste</span>
        </button>
      </div>
    </div>
  );
};
