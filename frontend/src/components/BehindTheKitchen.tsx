import React from 'react';
import { 
  ChefHat, 
  Flame, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  Clock, 
  CheckCircle2, 
  Leaf,
  Layers
} from 'lucide-react';

export const BehindTheKitchen: React.FC = () => {
  const kitchenFeatures = [
    {
      icon: Flame,
      title: '1,000°F Clay Tandoors',
      desc: 'Authentic underground clay pits fired with natural hardwood charcoal for that signature smoky char and locked-in succulent moisture.',
      color: 'from-orange-500 to-red-600',
    },
    {
      icon: Leaf,
      title: 'Pristine Farm Ingredients',
      desc: 'Cold-pressed mustard oils, hand-plucked Kashmiri saffron, aged Daawat basmati rice, and certified hormone-free spring chicken delivered daily.',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: ShieldCheck,
      title: 'Sterilized Tamper-Proof Seal',
      desc: 'Airtight thermal-lock packaging with holographic security seals. Guaranteed untouched from master chef handoff to your doorstep.',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      icon: Clock,
      title: 'Made-to-Order Freshness',
      desc: 'Zero pre-cooked buffet holding. Every handi biryani is slow-dum cooked and sealed specifically when your order coordinate triggers.',
      color: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-28 border-y border-amber-500/20">
      
      {/* Background Lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse duration-[10000ms]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-amber-300 mb-4 shadow-lg shadow-orange-950/40">
            <ChefHat className="w-4 h-4 text-amber-400" />
            <span>Behind The Galactic Kitchen</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Supersonic Speed Meets{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Heritage Culinary Craft.
            </span>
          </h2>

          <p className="mt-3 text-slate-300 text-sm sm:text-base font-normal">
            Inside Food Rocket's high-tech cloud kitchen facility: where master chefs combine centuries-old royal culinary recipes with aerospace logistics.
          </p>
        </div>

        {/* Master Chef Showcase Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-amber-500/50">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1000&q=80"
                alt="Executive Master Chef"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-white/10">
                <span className="text-xs font-black text-white block">Chef Farhan Qureshi</span>
                <span className="text-[11px] text-amber-400 block font-mono">3rd Gen Awadhi Master Chef & Culinary Director</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-extrabold border border-amber-500/40">
              <Award className="w-3.5 h-3.5" />
              <span>Michelin-Trained Cloud Kitchen Team</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white">
              "We Don't Reheat. We Craft Every Sealed Handi on Live Charcoal Fire."
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Every biryani pot is individually sealed with whole wheat dough (parda dum) to lock in the saffron and cardamom aromas. When our delivery rocket lands at your coordinates, breaking that seal unleashes the exact same explosive bouquet as dining inside an emperor's royal court.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800">
              <div>
                <span className="text-2xl font-black text-amber-400 block">1,000°F</span>
                <span className="text-xs text-slate-400">Clay Tandoor Heat</span>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-400 block">100%</span>
                <span className="text-xs text-slate-400">Untouched Sterilization</span>
              </div>
              <div>
                <span className="text-2xl font-black text-orange-400 block">30 Mins</span>
                <span className="text-xs text-slate-400">Guaranteed Fresh Landing</span>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kitchenFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-slate-900/80 hover:bg-slate-850 p-6 rounded-3xl border border-slate-800 hover:border-amber-500/50 shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
