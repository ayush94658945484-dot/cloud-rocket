import React, { useState, useEffect, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  vx: number;
  vy: number;
}

interface AmbientRocket {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  angle: number;
  duration: number;
  scale: number;
}

export const FlyingRocketAtmosphere: React.FC = () => {
  const [fxEnabled, setFxEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('food_rocket_fx_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [ambientRocket, setAmbientRocket] = useState<AmbientRocket | null>(null);

  // References for smooth cursor following
  const currentPos = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const targetPos = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const currentAngle = useRef<number>(45);
  const isMoving = useRef<boolean>(false);
  const lastMoveTime = useRef<number>(Date.now());
  const particles = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Detect touch device
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  // Save FX toggle
  const toggleFx = () => {
    setFxEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('food_rocket_fx_enabled', String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Mouse move listener
  useEffect(() => {
    if (!fxEnabled || isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      lastMoveTime.current = Date.now();
      isMoving.current = true;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [fxEnabled, isTouchDevice]);

  // Main animation loop for cursor rocket & smoke particles
  useEffect(() => {
    if (!fxEnabled || isTouchDevice) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    let particleCounter = 0;

    const loop = () => {
      // 1. Lerp cursor rocket position
      const dx = targetPos.current.x - currentPos.current.x;
      const dy = targetPos.current.y - currentPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 1) {
        currentPos.current.x += dx * 0.14;
        currentPos.current.y += dy * 0.14;

        // Smooth rotation towards movement direction
        const targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        let diff = targetAngle - currentAngle.current;
        while (diff < -180) diff += 360;
        while (diff > 180) diff -= 360;
        currentAngle.current += diff * 0.2;

        // Spawn exhaust particles if moving fast enough
        if (dist > 4 && Math.random() < 0.7) {
          const rad = ((currentAngle.current - 90) * Math.PI) / 180;
          const exhaustX = currentPos.current.x - Math.cos(rad) * 18;
          const exhaustY = currentPos.current.y - Math.sin(rad) * 18;

          const colors = ['#f97316', '#fbbf24', '#ef4444', '#ffffff', '#fed7aa'];
          particles.current.push({
            id: ++particleCounter,
            x: exhaustX + (Math.random() - 0.5) * 6,
            y: exhaustY + (Math.random() - 0.5) * 6,
            size: Math.random() * 4 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: 0.9,
            vx: -Math.cos(rad) * (Math.random() * 2 + 1) + (Math.random() - 0.5) * 1.5,
            vy: -Math.sin(rad) * (Math.random() * 2 + 1) + (Math.random() - 0.5) * 1.5,
          });
        }
      }

      // Check if mouse stopped
      if (Date.now() - lastMoveTime.current > 150) {
        isMoving.current = false;
      }

      // 2. Render particles on canvas
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.current.length - 1; i >= 0; i--) {
          const p = particles.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.opacity -= 0.035;
          p.size = Math.max(0.5, p.size * 0.96);

          if (p.opacity <= 0) {
            particles.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Soft glow
          if (p.size > 2.5) {
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 6;
            ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      // Update state for DOM rocket position
      setMousePos({ x: currentPos.current.x, y: currentPos.current.y });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [fxEnabled, isTouchDevice]);

  // Ambient Flying Rockets that streak across full website periodically
  useEffect(() => {
    if (!fxEnabled) return;

    const launchAmbientRocket = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Start from bottom-left or bottom edge, fly towards top-right
      const startX = -80;
      const startY = height * (0.4 + Math.random() * 0.5);
      const endX = width + 120;
      const endY = height * (0.05 + Math.random() * 0.35);

      const dx = endX - startX;
      const dy = endY - startY;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

      setAmbientRocket({
        id: Date.now(),
        startX,
        startY,
        endX,
        endY,
        angle,
        duration: 4.5 + Math.random() * 2.5,
        scale: 0.75 + Math.random() * 0.35,
      });

      // Clear after animation completes
      setTimeout(() => {
        setAmbientRocket(null);
      }, 7500);
    };

    // Initial launch after 3.5s
    const firstTimeout = setTimeout(launchAmbientRocket, 3500);

    // Recurring launches every 14-20 seconds
    const interval = setInterval(() => {
      launchAmbientRocket();
    }, 16000);

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, [fxEnabled]);

  return (
    <>
      {/* Canvas for cursor rocket exhaust particles */}
      {fxEnabled && !isTouchDevice && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-[9990]"
          style={{ width: '100vw', height: '100vh' }}
        />
      )}

      {/* 1. CURSOR-FOLLOWING ROCKET */}
      {fxEnabled && !isTouchDevice && mousePos.x > 0 && (
        <div
          className="fixed pointer-events-none z-[9991] transition-opacity duration-300 select-none"
          style={{
            transform: `translate3d(${mousePos.x - 20}px, ${mousePos.y - 20}px, 0) rotate(${currentAngle.current}deg)`,
            willChange: 'transform',
          }}
        >
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Thruster Flame SVG (animated flickers) */}
            <div
              className={`absolute -bottom-3 left-1/2 -translate-x-1/2 transition-transform duration-75 ${
                isMoving.current ? 'scale-125 opacity-100' : 'scale-75 opacity-60'
              }`}
            >
              <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
                {/* Outer Orange Flame */}
                <path
                  d="M7 20C4.5 15.5 1 11 1 6.5C1 2.9 3.7 0 7 0C10.3 0 13 2.9 13 6.5C13 11 9.5 15.5 7 20Z"
                  fill="url(#exhaustOrange)"
                  className="animate-pulse"
                />
                {/* Inner Yellow Core */}
                <path
                  d="M7 16C5.5 12.5 3 9 3 5.5C3 3 4.8 1 7 1C9.2 1 11 3 11 5.5C11 9 8.5 12.5 7 16Z"
                  fill="#fef08a"
                />
                <defs>
                  <linearGradient id="exhaustOrange" x1="7" y1="0" x2="7" y2="20" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fbbf24" />
                    <stop offset="0.6" stopColor="#f97316" />
                    <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Detailed Rocket Ship Body */}
            <svg width="34" height="34" viewBox="0 0 40 40" fill="none" className="drop-shadow-lg">
              {/* Left Wing / Fin */}
              <path
                d="M12 28L4 32C4 32 6 24 10 20L12 28Z"
                fill="#ea580c"
                stroke="#c2410c"
                strokeWidth="1.2"
              />
              {/* Right Wing / Fin */}
              <path
                d="M28 28L36 32C36 32 34 24 30 20L28 28Z"
                fill="#ea580c"
                stroke="#c2410c"
                strokeWidth="1.2"
              />
              {/* Rocket Main Fuselage */}
              <path
                d="M20 3C15 10 12 18 12 30C12 31.5 13.5 33 15 33H25C26.5 33 28 31.5 28 30C28 18 25 10 20 3Z"
                fill="url(#fuselageGradient)"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              {/* Rocket Nose Tip (Food Rocket Emerald Green) */}
              <path
                d="M20 3C17.5 7 15.5 11 15 14H25C24.5 11 22.5 7 20 3Z"
                fill="#16a34a"
              />
              {/* Center Cockpit Porthole with Food Rocket Mascot Eye/Chef Hat */}
              <circle cx="20" cy="20" r="4.5" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.5" />
              <circle cx="20" cy="20" r="3" fill="#38bdf8" />
              <circle cx="18.8" cy="18.8" r="1.2" fill="#ffffff" />

              {/* Bottom Thruster Nozzle */}
              <rect x="16" y="32" width="8" height="3" rx="1.5" fill="#475569" stroke="#334155" />

              <defs>
                <linearGradient id="fuselageGradient" x1="12" y1="3" x2="28" y2="33" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ffffff" />
                  <stop offset="0.4" stopColor="#fed7aa" />
                  <stop offset="1" stopColor="#ea580c" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      )}

      {/* 2. AMBIENT FULL-WEBSITE FLYING ROCKET (Periodic Sky Streaks) */}
      {fxEnabled && ambientRocket && (
        <div
          key={ambientRocket.id}
          className="fixed pointer-events-none z-[9980] select-none"
          style={{
            left: `${ambientRocket.startX}px`,
            top: `${ambientRocket.startY}px`,
            transform: `scale(${ambientRocket.scale}) rotate(${ambientRocket.angle}deg)`,
            animation: `ambientRocketFlight ${ambientRocket.duration}s cubic-bezier(0.25, 1, 0.5, 1) forwards`,
            '--ambient-end-x': `${ambientRocket.endX - ambientRocket.startX}px`,
            '--ambient-end-y': `${ambientRocket.endY - ambientRocket.startY}px`,
          } as React.CSSProperties}
        >
          <div className="relative flex items-center justify-center">
            {/* Long Smoke & Sparkle Jet Trail */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-3 h-32 bg-gradient-to-b from-amber-400 via-orange-500/40 to-transparent blur-[1.5px] rounded-full animate-pulse" />
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-1.5 h-20 bg-gradient-to-b from-white via-amber-200 to-transparent rounded-full" />

            {/* Glowing Food Rocket Mascot Ship */}
            <div className="relative w-14 h-14 p-1 rounded-full bg-white/90 backdrop-blur-md shadow-2xl shadow-orange-500/60 ring-2 ring-emerald-500/80">
              <img
                src="/food-rocket-logo.png"
                alt="Flying Rocket"
                className="w-full h-full object-contain"
              />
              <span className="absolute -top-1 -right-1 text-xs">🚀</span>
            </div>

            {/* Speed Lines */}
            <div className="absolute -left-6 top-0 w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-300 opacity-60" />
            <div className="absolute -right-6 top-4 w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-300 opacity-60" />
          </div>
        </div>
      )}

      {/* 3. SUBTLE FX TOGGLE PILL (Bottom Left Floating) */}
      <div className="fixed bottom-4 left-4 z-[9985] group hidden sm:block">
        <button
          type="button"
          onClick={toggleFx}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold backdrop-blur-md border shadow-lg transition-all cursor-pointer ${
            fxEnabled
              ? 'bg-slate-900/85 hover:bg-slate-900 text-amber-300 border-orange-500/40 shadow-orange-950/30'
              : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 border-slate-700 shadow-black/20'
          }`}
          title="Toggle Flying Rocket Cursor and Animations"
        >
          <span className={`text-xs ${fxEnabled ? 'animate-bounce' : ''}`}>🚀</span>
          <span>Rocket FX: {fxEnabled ? 'ON' : 'OFF'}</span>
          <span
            className={`w-2 h-2 rounded-full ${
              fxEnabled ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
            }`}
          />
        </button>
      </div>

      {/* Global CSS for Ambient Flying Rocket Trajectory */}
      <style>{`
        @keyframes ambientRocketFlight {
          0% {
            transform: translate3d(0, 0, 0) rotate(var(--angle, 45deg)) scale(0.6);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate3d(var(--ambient-end-x), var(--ambient-end-y), 0) rotate(var(--angle, 45deg)) scale(1.1);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

