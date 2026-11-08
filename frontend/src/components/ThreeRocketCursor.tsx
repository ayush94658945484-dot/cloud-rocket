import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { create3DRocket } from '../utils/threeRocketModel';

export const ThreeRocketCursor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [fxEnabled, setFxEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('food_rocket_fx_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  useEffect(() => {
    if (!fxEnabled || isTouchDevice || !containerRef.current) return;

    const container = containerRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffedd5, 2.5);
    dirLight.position.set(8, 12, 10);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    fillLight.position.set(-8, -6, 5);
    scene.add(fillLight);

    // 3. 3D Rocket Model
    const { rocketGroup, updateFlame } = create3DRocket(false);
    rocketGroup.scale.set(0.65, 0.65, 0.65);
    scene.add(rocketGroup);

    // 4. Exhaust Particles in 3D
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleAlphas = new Float32Array(particleCount);
    const particleSizes = new Float32Array(particleCount);
    const particleVelocities: { x: number; y: number; z: number; life: number; maxLife: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = 0;
      particlePositions[i * 3 + 1] = -100;
      particlePositions[i * 3 + 2] = 0;
      particleAlphas[i] = 0;
      particleSizes[i] = 0;
      particleVelocities.push({ x: 0, y: 0, z: 0, life: 0, maxLife: 30 });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('alpha', new THREE.BufferAttribute(particleAlphas, 1));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

    const particleMat = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.28,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    let nextParticleIndex = 0;

    // Mouse coordinates in 3D world space
    const target3D = new THREE.Vector3(0, 0, 0);
    const current3D = new THREE.Vector3(0, 0, 0);
    const velocity = new THREE.Vector3(0, 0, 0);
    let hasMoved = false;

    // Convert screen coordinates to world coordinates at z=0 plane
    const onMouseMove = (e: MouseEvent) => {
      hasMoved = true;
      const ndcX = (e.clientX / window.innerWidth) * 2 - 1;
      const ndcY = -(e.clientY / window.innerHeight) * 2 + 1;

      // Project onto z=0
      const vec = new THREE.Vector3(ndcX, ndcY, 0.5);
      vec.unproject(camera);
      vec.sub(camera.position).normalize();
      const distance = -camera.position.z / vec.z;
      target3D.copy(camera.position).add(vec.multiplyScalar(distance));
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Main 3D Animation Loop
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (hasMoved) {
        // Calculate delta & distance
        velocity.copy(target3D).sub(current3D);
        const dist = velocity.length();

        // Smooth Lerp Position
        current3D.x += velocity.x * 0.12;
        current3D.y += velocity.y * 0.12;
        current3D.z = Math.sin(Date.now() * 0.003) * 0.25; // Gentle float hover depth
        rocketGroup.position.copy(current3D);

        // Smooth 3D Banking & Pitch & Yaw
        const targetPitch = -velocity.y * 0.22;
        const targetRoll = -velocity.x * 0.35;
        const targetYaw = Math.atan2(velocity.x, velocity.y) * 0.45;

        rocketGroup.rotation.x = THREE.MathUtils.lerp(rocketGroup.rotation.x, targetPitch, 0.12);
        rocketGroup.rotation.z = THREE.MathUtils.lerp(rocketGroup.rotation.z, targetRoll, 0.12);
        rocketGroup.rotation.y = THREE.MathUtils.lerp(rocketGroup.rotation.y, targetYaw, 0.12);

        // Flame thrust increases when moving faster
        const speed = Math.min(dist * 0.8, 2.5);
        updateFlame(0.7 + speed);

        // Emit exhaust particles from rocket engine nozzle
        if (dist > 0.08) {
          const pIdx = nextParticleIndex;
          nextParticleIndex = (nextParticleIndex + 1) % particleCount;

          const nozzleWorldPos = new THREE.Vector3(0, -1.8, 0);
          rocketGroup.localToWorld(nozzleWorldPos);

          const posArr = particleGeo.attributes.position.array as Float32Array;
          posArr[pIdx * 3] = nozzleWorldPos.x + (Math.random() - 0.5) * 0.15;
          posArr[pIdx * 3 + 1] = nozzleWorldPos.y + (Math.random() - 0.5) * 0.15;
          posArr[pIdx * 3 + 2] = nozzleWorldPos.z + (Math.random() - 0.5) * 0.15;

          particleVelocities[pIdx] = {
            x: (Math.random() - 0.5) * 0.06,
            y: -0.05 - Math.random() * 0.08,
            z: (Math.random() - 0.5) * 0.06,
            life: 30,
            maxLife: 30
          };
        }
      } else {
        updateFlame(0.7);
      }

      // Update particle positions & fade
      const posArr = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        if (particleVelocities[i].life > 0) {
          posArr[i * 3] += particleVelocities[i].x;
          posArr[i * 3 + 1] += particleVelocities[i].y;
          posArr[i * 3 + 2] += particleVelocities[i].z;
          particleVelocities[i].life--;
        } else {
          posArr[i * 3 + 1] = -999;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [fxEnabled, isTouchDevice]);

  // Ambient Flying Rocket periodic triggers
  const [ambientStreak, setAmbientStreak] = useState<boolean>(false);

  useEffect(() => {
    if (!fxEnabled) return;
    const interval = setInterval(() => {
      setAmbientStreak(true);
      setTimeout(() => setAmbientStreak(false), 5500);
    }, 18000);
    return () => clearInterval(interval);
  }, [fxEnabled]);

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

  return (
    <>
      {/* 3D WebGL Canvas Overlay for 3D Rocket Cursor */}
      {fxEnabled && !isTouchDevice && (
        <div
          ref={containerRef}
          className="fixed inset-0 pointer-events-none z-[9990] overflow-hidden select-none"
        />
      )}

      {/* Ambient 3D Rocket Streak Across Full Website */}
      {fxEnabled && ambientStreak && (
        <div className="fixed pointer-events-none z-[9980] animate-ambient-3d-rocket select-none">
          <div className="relative w-20 h-20 p-2 rounded-full bg-white/95 backdrop-blur-md shadow-2xl shadow-orange-500/80 ring-4 ring-emerald-500/80">
            <img src="/food-rocket-logo.png" alt="3D Rocket Flight" className="w-full h-full object-contain" />
            <span className="absolute -top-1 -right-1 text-sm">🚀</span>
          </div>
        </div>
      )}

      {/* Floating 3D FX Controls Badge */}
      <div className="fixed bottom-4 left-4 z-[9985] group hidden sm:block">
        <button
          type="button"
          onClick={toggleFx}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-black backdrop-blur-md border shadow-xl transition-all cursor-pointer ${
            fxEnabled
              ? 'bg-slate-900/90 hover:bg-slate-900 text-amber-300 border-orange-500/60 shadow-orange-950/40'
              : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 border-slate-700 shadow-black/30'
          }`}
          title="Toggle 3D Flying Rocket Cursor and Animations"
        >
          <span className={`text-xs ${fxEnabled ? 'animate-bounce' : ''}`}>🚀</span>
          <span>3D Rocket FX: {fxEnabled ? 'ON' : 'OFF'}</span>
          <span
            className={`w-2 h-2 rounded-full ${
              fxEnabled ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
            }`}
          />
        </button>
      </div>

      <style>{`
        @keyframes ambient3DRocket {
          0% {
            transform: translate3d(-100px, 80vh, 0) rotate(35deg) scale(0.7);
            opacity: 0;
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% {
            transform: translate3d(110vw, 15vh, 0) rotate(35deg) scale(1.2);
            opacity: 0;
          }
        }
        .animate-ambient-3d-rocket {
          animation: ambient3DRocket 5.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>
    </>
  );
};

