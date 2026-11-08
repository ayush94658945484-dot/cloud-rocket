import React from 'react';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  X, 
  Gift, 
  Zap, 
  Flame, 
  ChevronRight,
  Copy
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FoodPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreMenu?: () => void;
}

export const FoodPassportModal: React.FC<FoodPassportModalProps> = ({ 
  isOpen, 
  onClose, 
  onExploreMenu 
}) => {
  const { user, openAuthModal } = useAuth();

  if (!isOpen) return null;

  // Calculate tier & milestones
  const points = user?.points || 150;
  const tier = points >= 1000 ? 'Fleet Admiral' : points >= 400 ? 'Commander' : 'Cadet';
  const tierColor = tier === 'Fleet Admiral' ? 'text-amber-400' : tier === 'Commander' ? 'text-cyan-400' : 'text-emerald-400';

  const badges = [
    { id: 1, title: 'First Rocket Launch', icon: '🚀', desc: 'Placed first supersonic delivery', unlocked: true },
    { id: 2, title: 'Biryani Connoisseur', icon: '👑', desc: 'Ordered authentic sealed handi dum', unlocked: true },
    { id: 3, title: 'Clay Tandoor Voyager', icon: '🔥', desc: 'Tested 1,000°F clay-smoked tikkas', unlocked: points >= 300 },
    { id: 4, title: 'Supersonic Speedster', icon: '⚡', desc: 'Reordered within 48 hours', unlocked: points >= 500 },
    { id: 5, title: 'Cosmic Party Host', icon: '🪐', desc: 'Hosted a collaborative group order', unlocked: points >= 750 },
    { id: 6, title: 'Fleet Admiral Supreme', icon: '🌟', desc: 'Earned 1,000+ loyalty miles', unlocked: points >= 1000 },
  ];

  const milestones = [
    { code: 'ROCKET50', reward: '50% OFF up to ₹100 on First Order', minPoints: 0, unlocked: true },
    { code: 'SWEETDROP', reward: 'Complimentary Saffron Gulab Jamun (2 pcs)', minPoints: 300, unlocked: points >= 300 },
    { code: 'FREESHIP', reward: 'Free Doorstep Delivery on Any Order', minPoints: 500, unlocked: points >= 500 },
    { code: 'ADMIRAL150', reward: 'Flat ₹150 OFF on Feasting Combos', minPoints: 800, unlocked: points >= 800 },
  ];

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Coupon code '${code}' copied to clipboard! Paste it at checkout.`);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Golden Cyber-Passport Document */}
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-amber-500/70 rounded-3xl overflow-hidden shadow-2xl shadow-orange-950/90 my-8 flex flex-col max-h-[88vh]">
        
        {/* Passport Header */}
        <div className="p-6 bg-radial from-slate-900 to-slate-950 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-2xl shadow-lg shadow-orange-900/50">
              🛸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-extrabold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  OFFICIAL COSMIC PASSPORT
                </span>
                <span className={`text-xs font-black ${tierColor}`}>
                  ★ {tier} Tier
                </span>
              </div>
              <h3 className="text-xl font-black text-white mt-0.5">
                {user ? user.name : 'Cosmic Explorer'}
              </h3>
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

        {/* Passport Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Miles Balance Card */}
          <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-orange-950/60 border border-amber-500/40 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono text-slate-400 block uppercase">
                Accumulated Food Miles (Points)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-amber-400">{points}</span>
                <span className="text-xs text-amber-200/80 font-bold">Rocket Miles</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Earn 10 miles for every ₹100 spent on completed deliveries.</p>
            </div>

            {!user && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openAuthModal('login');
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
              >
                Sign In to Save Points
              </button>
            )}
          </div>

          {/* Achievement Badges Grid */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Cosmic Achievement Badges</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${
                    b.unlocked
                      ? 'bg-slate-900/90 border-amber-500/50 shadow-md'
                      : 'bg-slate-950/40 border-slate-800 opacity-50 grayscale'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{b.icon}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${b.unlocked ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-500'}`}>
                      {b.unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs font-black text-white block">{b.title}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{b.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Redeemable Milestone Coupons */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-emerald-400" />
              <span>Unlocked Food Milestone Perks</span>
            </h4>

            <div className="space-y-2.5">
              {milestones.map((m) => (
                <div
                  key={m.code}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                    m.unlocked
                      ? 'bg-slate-900/90 border-emerald-500/40'
                      : 'bg-slate-950/40 border-slate-800 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                        {m.code}
                      </span>
                      <span className="text-xs font-black text-white">{m.reward}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Required: {m.minPoints} points {m.unlocked ? '• Ready to use' : `• Need ${m.minPoints - points} more`}
                    </span>
                  </div>

                  {m.unlocked ? (
                    <button
                      type="button"
                      onClick={() => copyCoupon(m.code)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer shadow-sm"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-mono">Locked</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Passport Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Official Food Rocket Kitchen Galactic Registry</span>
          <button
            type="button"
            onClick={onClose}
            className="text-amber-400 font-bold hover:underline cursor-pointer"
          >
            Close Passport
          </button>
        </div>

      </div>

    </div>
  );
};
