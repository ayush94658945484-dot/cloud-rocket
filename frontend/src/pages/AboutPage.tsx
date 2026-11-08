import React from 'react';
import { ChefHat, ShieldCheck, Flame, Clock, Heart, Award, Sparkles } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const AboutPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-orange-600 font-extrabold text-xs uppercase tracking-widest bg-orange-100 px-3.5 py-1 rounded-full">
          The Cloud Culinary Revolution
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">
          Redefining Gourmet Food Delivery
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {settings.business_name || 'Food Rocket'} was founded on a simple philosophy: Deliver fine-dining culinary masterworks straight to your home with the exact warmth, aroma, and presentation of a 5-star restaurant.
        </p>
      </div>

      {/* Visual Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl h-80 sm:h-96">
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80"
            alt="Master Chef Kitchen"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">Master Kitchen Suite</span>
            <h3 className="text-xl font-bold">Engineered for Delivery Precision</h3>
          </div>
        </div>

        <div className="space-y-6">
          <span className="text-xs font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">
            Our Cloud Kitchen Philosophy
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
            Why We Chose a Cloud-First Delivery Model
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Traditional restaurants spend 60% of their operational budget on prime street real estate, chandeliers, and waitstaff. We reinvest all of that capital into <strong>premium organic ingredients, specialized clay tandoors, and hospital-grade kitchen hygiene</strong>.
          </p>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Every recipe has been scientifically calibrated so that it continues to mature in its insulated container during transit—ensuring your biryani or curry reaches peak flavor right at your doorstep.
          </p>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-10 border-t border-slate-100">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Wood-Fired Dum Cooking</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Sealed clay handis trap all natural moisture and whole spice oils without artificial flavoring.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">FSSAI Sterilized Prep</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Triple air filtration, daily health checks, and UV-C sanitization before packaging.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <ChefHat className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Artisanal Master Chefs</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Over 40 collective years of experience in royal Awadhi, Mughlai, and Pan-Asian cuisines.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Express 30-Min Dispatch</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Synchronized kitchen timers ensure meals are packed in under 12 minutes for rapid departure.
          </p>
        </div>
      </div>
    </div>
  );
};

