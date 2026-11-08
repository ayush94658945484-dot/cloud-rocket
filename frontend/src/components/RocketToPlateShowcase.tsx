import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Rocket, 
  Flame, 
  Sparkles, 
  ShoppingBag, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ChevronRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { FoodItem } from '../types';

interface RocketToPlateShowcaseProps {
  onNavigate: (page: string, params?: any) => void;
}

export const RocketToPlateShowcase: React.FC<RocketToPlateShowcaseProps> = ({ onNavigate }) => {
  const { addToCart, setIsCartOpen } = useCart();
  
  // Stages: 'ready' -> 'launching' -> 'blasting' -> 'chicken_revealed'
  const [stage, setStage] = useState<'ready' | 'launching' | 'blasting' | 'chicken_revealed'>('ready');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [hasLandedOnce, setHasLandedOnce] = useState<boolean>(false);
  const [autoOrdered, setAutoOrdered] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio Context safely
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Sound Synth: Rocket Launch Whoosh
  const playLaunchSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.3);
    } catch (e) {
      console.warn('Audio not allowed yet:', e);
    }
  };

  // Sound Synth: Explosive Blast onto Plate
  const playBlastSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      // Low sub boom
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);

      // Noise crackle burst
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.4);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn('Audio not allowed yet:', e);
    }
  };

  // Sound Synth: Triumphant Magic Chime when Chicken Appears
  const playTriumphSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0.01, ctx.currentTime + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.1 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.6);
      });
    } catch (e) {
      console.warn('Audio not allowed yet:', e);
    }
  };

  // Trigger Launch Sequence
  const launchRocket = () => {
    if (stage === 'launching' || stage === 'blasting') return;

    setStage('launching');
    playLaunchSound();

    // Flight takes 1.4 seconds before impacting the plate
    setTimeout(() => {
      setStage('blasting');
      playBlastSound();

      // Confetti firework explosion centered around the plate!
      try {
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.72 },
          colors: ['#f97316', '#fbbf24', '#ef4444', '#16a34a', '#ffffff'],
        });
      } catch (e) {
        console.warn(e);
      }

      // Explosion clears after 650ms, revealing the chicken
      setTimeout(() => {
        setStage('chicken_revealed');
        setHasLandedOnce(true);
        playTriumphSound();
      }, 650);

    }, 1400);
  };

  // Auto trigger once when first entering view if wanted
  useEffect(() => {
    const timer = setTimeout(() => {
      if (stage === 'ready' && !hasLandedOnce) {
        launchRocket();
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Quick Order Signature Chicken
  const handleOrderHotChicken = () => {
    const signatureChicken: FoodItem = {
      id: 9,
      category_id: 3,
      name: "Hyderabadi Dum Chicken Biryani",
      description: "Aged Daawat basmati rice slow-dum cooked in sealed handi with marinated spring chicken, saffron and mint.",
      price: 369,
      discount_price: 319,
      is_veg: 0,
      is_available: 1,
      is_bestseller: 1,
      is_featured: 1,
      image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
      preparation_time: "25 mins",
      calories: 620,
      rating: 5,
      reviews_count: 48,
      category_name: "Royal Biryani & Rice",
      category_slug: "rice-biryani"
    };

    addToCart(signatureChicken, 1);
    setIsCartOpen(true);
    setAutoOrdered(true);
    setTimeout(() => setAutoOrdered(false), 3000);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 sm:py-24 border-y border-orange-500/30">
      
      {/* Background Starfield & Space Glow Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl animate-pulse duration-[10000ms]" />
        <div className="absolute inset-0 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:28px_28px] opacity-20" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-emerald-500/20 border border-orange-500/40 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-amber-300 mb-4 shadow-lg shadow-orange-950/40">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>Interactive Rocket Delivery Theater</span>
            <span className="text-sm">💥🍽️</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Watch Our Rocket Blast{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Fresh Hot Chicken
            </span>{' '}
            Directly Onto Your Plate!
          </h2>

          <p className="mt-3 text-slate-300 text-sm sm:text-base font-normal">
            Supersonic speed from clay tandoor flames right onto your dining platter in 30 minutes flat. Tap the button to launch the rocket!
          </p>

          {/* Sound Toggle */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="inline-flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white px-3 py-1 rounded-full text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sound Effects: ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sound Effects: MUTED</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 🎬 THE INTERACTIVE ARENA */}
        <div className="relative mx-auto max-w-3xl h-[460px] sm:h-[500px] rounded-3xl bg-radial from-slate-900 via-slate-950 to-black border-2 border-orange-500/40 shadow-2xl shadow-orange-950/80 overflow-hidden flex flex-col justify-between p-6 select-none">
          
          {/* Top Status Telemetry HUD */}
          <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 z-20">
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400">RADAR: ONLINE</span>
            </div>

            <div className="bg-slate-900/90 border border-orange-500/40 px-3 py-1 rounded-lg text-amber-300 flex items-center gap-1.5">
              <span>MISSION:</span>
              <span className="font-extrabold text-white">
                {stage === 'ready' && '🚀 WAITING FOR LAUNCH'}
                {stage === 'launching' && '⚡ ROCKET INBOUND AT MACH 3'}
                {stage === 'blasting' && '💥 IMPACT & TASTE BLAST!'}
                {stage === 'chicken_revealed' && '🍗 CHICKEN DELIVERED HOT!'}
              </span>
            </div>
          </div>

          {/* FLIGHT STAGE (Rocket, Blast & Chicken) */}
          <div className="relative flex-1 flex items-center justify-center">
            
            {/* 1. THE BIG ROCKET (Flying Inbound) */}
            {(stage === 'ready' || stage === 'launching') && (
              <div
                className={`absolute z-30 transition-all ${
                  stage === 'launching'
                    ? 'top-[160px] scale-110 duration-[1350ms] ease-in'
                    : 'top-4 scale-90 duration-500'
                }`}
                style={{
                  filter: 'drop-shadow(0 15px 25px rgba(249, 115, 22, 0.6))',
                }}
              >
                <div className="relative flex flex-col items-center">
                  
                  {/* Detailed Big Food Rocket Vessel SVG */}
                  <div className="relative w-28 sm:w-36 h-40 sm:h-48 flex items-center justify-center">
                    <svg viewBox="0 0 120 180" className="w-full h-full" fill="none">
                      {/* Left Booster Rocket */}
                      <path
                        d="M20 70C15 85 15 130 15 145C15 148 18 150 22 150H32C36 150 39 148 39 145C39 130 39 85 34 70Z"
                        fill="url(#boosterGradLeft)"
                        stroke="#c2410c"
                        strokeWidth="2"
                      />
                      {/* Left Booster Fin */}
                      <path d="M15 110L2 145H15V110Z" fill="#ea580c" />
                      {/* Left Booster Flame */}
                      <path
                        d="M20 150C24 168 27 180 27 180C27 180 30 168 34 150Z"
                        fill="#f59e0b"
                        className="animate-pulse"
                      />

                      {/* Right Booster Rocket */}
                      <path
                        d="M100 70C105 85 105 130 105 145C105 148 102 150 98 150H88C84 150 81 148 81 145C81 130 81 85 86 70Z"
                        fill="url(#boosterGradRight)"
                        stroke="#c2410c"
                        strokeWidth="2"
                      />
                      {/* Right Booster Fin */}
                      <path d="M105 110L118 145H105V110Z" fill="#ea580c" />
                      {/* Right Booster Flame */}
                      <path
                        d="M86 150C90 168 93 180 93 180C93 180 96 168 100 150Z"
                        fill="#f59e0b"
                        className="animate-pulse"
                      />

                      {/* Main Fuselage Body */}
                      <path
                        d="M60 8C45 35 34 70 34 135C34 142 38 146 44 146H76C82 146 86 142 86 135C86 70 75 35 60 8Z"
                        fill="url(#mainFuselageGrad)"
                        stroke="#ffffff"
                        strokeWidth="3"
                      />

                      {/* Emerald Aerodynamic Nose Tip */}
                      <path
                        d="M60 8C52 24 45 42 42 54H78C75 42 68 24 60 8Z"
                        fill="#16a34a"
                      />

                      {/* Food Rocket Chicken Mascot Crest / Round Emblem */}
                      <circle cx="60" cy="85" r="19" fill="#ffffff" stroke="#ea580c" strokeWidth="2.5" />
                      {/* Mini Chicken Head inside Porthole */}
                      <circle cx="60" cy="85" r="14" fill="#ffedd5" />
                      {/* Little Chef Hat */}
                      <path d="M53 76C51 76 50 78 51 80C51 82 53 82 54 82H66C67 82 69 82 69 80C70 78 69 76 67 76C66 73 63 73 60 74C57 73 54 73 53 76Z" fill="#ffffff" stroke="#f97316" strokeWidth="1" />
                      {/* Beak & Eye */}
                      <circle cx="58" cy="86" r="2" fill="#0f172a" />
                      <circle cx="58.5" cy="85.5" r="0.7" fill="#ffffff" />
                      <polygon points="63,85 68,88 63,91" fill="#ea580c" />

                      {/* Main Engine Center Nozzle */}
                      <rect x="48" y="146" width="24" height="8" rx="3" fill="#334155" stroke="#1e293b" />

                      {/* Enormous Roaring Center Flame Plume */}
                      <path
                        d="M48 154C42 178 60 215 60 215C60 215 78 178 72 154Z"
                        fill="url(#flameCenterGrad)"
                        className="animate-pulse"
                      />
                      {/* Inner Superheated Core */}
                      <path
                        d="M52 154C48 170 60 195 60 195C60 195 72 170 68 154Z"
                        fill="#ffffff"
                      />

                      <defs>
                        <linearGradient id="mainFuselageGrad" x1="34" y1="8" x2="86" y2="146" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#ffffff" />
                          <stop offset="0.3" stopColor="#fed7aa" />
                          <stop offset="0.75" stopColor="#f97316" />
                          <stop offset="1" stopColor="#c2410c" />
                        </linearGradient>
                        <linearGradient id="boosterGradLeft" x1="15" y1="70" x2="39" y2="150" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#ffffff" />
                          <stop offset="0.6" stopColor="#ea580c" />
                        </linearGradient>
                        <linearGradient id="boosterGradRight" x1="81" y1="70" x2="105" y2="150" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#ffffff" />
                          <stop offset="0.6" stopColor="#ea580c" />
                        </linearGradient>
                        <linearGradient id="flameCenterGrad" x1="60" y1="154" x2="60" y2="215" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#fde047" />
                          <stop offset="0.4" stopColor="#f97316" />
                          <stop offset="0.9" stopColor="#ef4444" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Speed Lines during launch */}
                    {stage === 'launching' && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-1 h-32 bg-amber-300/80 -translate-y-8 animate-ping" />
                        <div className="w-0.5 h-24 bg-white/90 -translate-x-8 -translate-y-12 animate-pulse" />
                        <div className="w-0.5 h-24 bg-white/90 translate-x-8 -translate-y-12 animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. THE BLAST / EXPLOSION (Stage: 'blasting') */}
            {stage === 'blasting' && (
              <div className="absolute z-40 bottom-16 flex flex-col items-center justify-center animate-in zoom-in-50 duration-200">
                
                {/* Comic Explosion Banner */}
                <div className="relative">
                  {/* Explosion Shockwave Rings */}
                  <div className="absolute -inset-12 rounded-full border-4 border-amber-400 bg-orange-600/30 animate-ping duration-500" />
                  <div className="absolute -inset-20 rounded-full border-2 border-yellow-200 opacity-60 animate-ping duration-700" />

                  {/* Comic Blast Burst SVG */}
                  <svg width="220" height="150" viewBox="0 0 220 150" className="animate-bounce">
                    <polygon
                      points="110,5 135,45 185,25 170,70 215,85 175,115 200,145 150,135 125,155 100,135 50,145 75,115 15,95 65,70 35,30 90,45"
                      fill="#ea580c"
                      stroke="#fbbf24"
                      strokeWidth="5"
                    />
                    <polygon
                      points="110,20 130,55 165,40 150,75 185,90 150,110 170,130 135,120 115,135 95,120 60,130 80,110 45,95 80,75 55,45 95,55"
                      fill="#fef08a"
                    />
                    <text
                      x="110"
                      y="92"
                      textAnchor="middle"
                      fill="#7c2d12"
                      fontSize="22"
                      fontWeight="900"
                      fontFamily="sans-serif"
                    >
                      💥 BOOM! 💥
                    </text>
                  </svg>
                </div>

                {/* Billowing Smoke Puffs */}
                <div className="flex gap-2 -mt-6">
                  <div className="w-12 h-12 rounded-full bg-white/80 blur-xs animate-ping" />
                  <div className="w-16 h-16 rounded-full bg-orange-200/90 blur-xs animate-pulse" />
                  <div className="w-12 h-12 rounded-full bg-amber-300/80 blur-xs animate-ping" />
                </div>
              </div>
            )}

            {/* 3. THE GRAND REVEAL: GOLDEN ROASTED CHICKEN ON THE PLATE (Stage: 'chicken_revealed') */}
            {stage === 'chicken_revealed' && (
              <div className="absolute z-30 bottom-14 flex flex-col items-center justify-center animate-in zoom-in-75 duration-500">
                
                {/* Animated Rising Steam Clouds (♨️) */}
                <div className="flex gap-4 -mb-2 z-20">
                  <div className="text-xl sm:text-2xl animate-bounce duration-[1500ms] opacity-80 select-none">♨️</div>
                  <div className="text-2xl sm:text-3xl animate-bounce duration-[1200ms] opacity-90 select-none">♨️</div>
                  <div className="text-xl sm:text-2xl animate-bounce duration-[1800ms] opacity-80 select-none">♨️</div>
                </div>

                {/* The Golden Crispy Roasted Chicken Illustration */}
                <div className="relative group cursor-pointer" onClick={handleOrderHotChicken} title="Click to Order this Hot Chicken!">
                  
                  {/* Glowing Platter Aura */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/40 via-orange-500/40 to-yellow-500/40 rounded-full blur-xl animate-pulse" />

                  {/* Detailed Delicious Roast Chicken SVG */}
                  <svg width="220" height="130" viewBox="0 0 240 140" className="relative z-10 drop-shadow-2xl">
                    {/* Chicken Juicy Shadow */}
                    <ellipse cx="120" cy="115" rx="85" ry="16" fill="#1c1917" opacity="0.6" />

                    {/* Fresh Herb Garnish Bed (Parsley & Mint Leaves) */}
                    <path d="M45 110C40 100 55 95 65 105C75 95 85 100 80 110Z" fill="#15803d" />
                    <path d="M160 110C155 100 170 95 180 105C190 95 200 100 195 110Z" fill="#15803d" />
                    
                    {/* Lemon Wedges on Side */}
                    <path d="M35 112A14 14 0 0 1 55 118L35 118Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
                    <path d="M205 118A14 14 0 0 1 185 112L205 118Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />

                    {/* Main Roasted Chicken Plump Breast / Body */}
                    <path
                      d="M60 100C50 75 70 45 110 40C155 35 185 65 180 100C175 115 65 115 60 100Z"
                      fill="url(#chickenGlazeGrad)"
                      stroke="#78350f"
                      strokeWidth="2.5"
                    />

                    {/* Golden Crispy Skin Texture / Sear Marks */}
                    <path d="M85 60C95 65 105 60 115 65" stroke="#451a03" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
                    <path d="M100 78C112 83 125 78 135 83" stroke="#451a03" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
                    <path d="M130 55C140 60 150 55 160 60" stroke="#451a03" strokeWidth="3" strokeLinecap="round" opacity="0.7" />

                    {/* Succulent Drumstick Leg 1 */}
                    <path
                      d="M140 85C165 75 185 85 195 100C190 108 175 110 155 105Z"
                      fill="url(#drumstickGrad)"
                      stroke="#78350f"
                      strokeWidth="2"
                    />
                    {/* Drumstick Bone with Chef Paper Frill */}
                    <path d="M190 95L210 90C214 88 217 92 215 95L195 102Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                    <circle cx="212" cy="88" r="4" fill="#f8fafc" />
                    <circle cx="215" cy="95" r="4" fill="#f8fafc" />

                    {/* Succulent Wing Tip */}
                    <path
                      d="M65 80C52 85 50 100 68 105Z"
                      fill="#b45309"
                      stroke="#78350f"
                      strokeWidth="1.5"
                    />

                    {/* Delicious Glossy Highlights */}
                    <path
                      d="M90 48C105 45 125 46 135 50C115 52 100 52 90 48Z"
                      fill="#ffffff"
                      opacity="0.6"
                    />
                    <ellipse cx="140" cy="70" rx="15" ry="6" fill="#ffffff" opacity="0.4" transform="rotate(-10 140 70)" />

                    <defs>
                      <linearGradient id="chickenGlazeGrad" x1="110" y1="40" x2="120" y2="115" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#fbbf24" />
                        <stop offset="0.3" stopColor="#ea580c" />
                        <stop offset="0.7" stopColor="#b45309" />
                        <stop offset="1" stopColor="#78350f" />
                      </linearGradient>
                      <linearGradient id="drumstickGrad" x1="140" y1="85" x2="195" y2="105" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#fbbf24" />
                        <stop offset="0.5" stopColor="#c2410c" />
                        <stop offset="1" stopColor="#78350f" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Sparkle Glints (✨) */}
                  <div className="absolute -top-2 left-10 text-amber-300 text-lg animate-ping">✨</div>
                  <div className="absolute top-6 right-8 text-yellow-300 text-xl animate-pulse">✨</div>
                </div>

                {/* Food Rocket Seal of Freshness Badge */}
                <div className="mt-2 inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-black text-xs px-3.5 py-1 rounded-full shadow-lg border border-emerald-400/50">
                  <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>100% PIPING HOT CHICKEN LANDED!</span>
                  <span className="text-amber-300">⚡ 0.8s</span>
                </div>
              </div>
            )}

            {/* 4. THE LUXURIOUS SERVING PLATE / PLATTER (At Bottom Center) */}
            <div className="absolute bottom-2 z-10 flex flex-col items-center">
              
              {/* Platter Glowing Targeting Reticle */}
              <div className="relative flex items-center justify-center">
                {/* Radar Ring */}
                <div className={`w-64 sm:w-80 h-16 rounded-[100%] border-2 border-dashed transition-colors ${
                  stage === 'launching' ? 'border-red-500 animate-pulse' : 'border-amber-400/60'
                }`} />

                {/* Laser Crosshairs */}
                <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
                <div className="absolute h-16 w-[1px] bg-gradient-to-b from-transparent via-amber-400/50 to-transparent" />

                {/* Heavy Silver & Gold Serving Platter */}
                <div className="absolute w-56 sm:w-72 h-14 rounded-[100%] bg-gradient-to-b from-slate-200 via-slate-400 to-slate-700 shadow-2xl ring-4 ring-amber-500/70 p-1 flex items-center justify-center">
                  {/* Inner Dish Basin */}
                  <div className="w-full h-full rounded-[100%] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border border-slate-500/40 flex items-center justify-center">
                    <span className="text-[10px] font-black tracking-widest uppercase text-amber-400/70">
                      🎯 FOOD ROCKET LANDING PLATTER
                    </span>
                  </div>
                </div>
              </div>

              {/* Pedestal Table Shadow */}
              <div className="w-72 sm:w-96 h-6 bg-black/60 blur-md rounded-full mt-1" />
            </div>

          </div>

          {/* Bottom Interactive Control Panel */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-xs rounded-2xl px-4 py-2.5">
            
            <div className="flex items-center gap-3">
              {stage === 'chicken_revealed' ? (
                <button
                  type="button"
                  onClick={launchRocket}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-orange-600/30 transition-all cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>🚀 Launch Another Blast!</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={stage === 'launching' || stage === 'blasting'}
                  onClick={launchRocket}
                  className={`inline-flex items-center gap-2 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xl transition-all cursor-pointer ${
                    stage === 'launching' || stage === 'blasting'
                      ? 'bg-slate-700 opacity-60 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:scale-105 active:scale-95 shadow-orange-600/50'
                  }`}
                >
                  <Rocket className="w-4 h-4 fill-white animate-bounce" />
                  <span>
                    {stage === 'launching' ? 'INCOMING ROCKET...' : stage === 'blasting' ? '💥 BLASTING!' : '🚀 LAUNCH ROCKET TO PLATE!'}
                  </span>
                </button>
              )}

              {stage === 'chicken_revealed' && (
                <button
                  type="button"
                  onClick={handleOrderHotChicken}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-900/40 transition-all cursor-pointer active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{autoOrdered ? '✓ Added to Cart!' : 'Order This Hot Chicken (₹319)'}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <button
                type="button"
                onClick={() => onNavigate('menu', { category: 'starters' })}
                className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Browse All Chicken Dishes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
