import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createCursorRocket, CursorRocketInstance } from '../utils/threeCursorRocket';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  r: number;
  g: number;
  b: number;
  size: number;
  life: number;
  maxLife: number;
}

export const ThreeRocketCursor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Persistence toggle for user preference
  const [fxEnabled, setFxEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('food_rocket_3d_cursor_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  // Check touch and reduced motion
  useEffect(() => {
    const isTouch = 
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 || 
      window.matchMedia('(pointer: coarse)').matches;
    
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setIsTouchDevice(isTouch);
    setIsReducedMotion(reducedMotion);
  }, []);

  useEffect(() => {
    // If disabled, touch device, or reduced motion, do not initialize
    if (!fxEnabled || isTouchDevice || isReducedMotion || !containerRef.current) {
      document.documentElement.classList.remove('has-3d-rocket-cursor');
      return;
    }

    // Apply cursor: none to hide default system pointer
    document.documentElement.classList.add('has-3d-rocket-cursor');

    const container = containerRef.current;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Orthographic Scene Setup (1 Unit = 1 Pixel)
    const scene = new THREE.Scene();
    
    // Top-left is (0, 0), bottom-right is (width, height)
    const camera = new THREE.OrthographicCamera(0, width, height, 0, -200, 200);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 2. Realistic Studio Lighting for Silver Metallic Chrome Body
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.8);
    keyLight.position.set(-50, -80, 100);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    fillLight.position.set(80, 50, 60);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf97316, 2.0);
    rimLight.position.set(0, 100, -50);
    scene.add(rimLight);

    // 3. 3D Metallic Rocket Model
    const rocketObj: CursorRocketInstance = createCursorRocket();
    scene.add(rocketObj.rocketRoot);
    rocketObj.shockwaves.forEach((sw) => scene.add(sw));

    // Initially position offscreen
    rocketObj.rocketRoot.position.set(-100, -100, 10);

    // 4. GPU Buffer Particle System for Flames, Smoke & Sparks
    const maxParticles = 90;
    const particles: Particle[] = [];
    const particlePositions = new Float32Array(maxParticles * 3);
    const particleColors = new Float32Array(maxParticles * 3);

    for (let i = 0; i < maxParticles; i++) {
      particlePositions[i * 3] = -9999;
      particlePositions[i * 3 + 1] = -9999;
      particlePositions[i * 3 + 2] = 0;
      particleColors[i * 3] = 1;
      particleColors[i * 3 + 1] = 0.5;
      particleColors[i * 3 + 2] = 0.1;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 4.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 5. Tracking Coordinates & Interaction State
    const mouse = {
      targetX: -100,
      targetY: -100,
      currX: -100,
      currY: -100,
      prevX: -100,
      prevY: -100,
      vx: 0,
      vy: 0,
      speed: 0,
      angle: -Math.PI / 4, // Default ~315 deg (top-left pointer arrow)
      targetAngle: -Math.PI / 4,
      roll: 0,
      pitch: 0,
      opacity: 0,
      targetOpacity: 1,
      hoverMode: 'default' as 'default' | 'button' | 'order' | 'menu' | 'food',
      lastMoveTime: performance.now(),
      isMoving: false,
      recoil: 0,
    };

    // Spawn exhaust & sparkle particles
    const spawnParticle = (
      x: number,
      y: number,
      vx: number,
      vy: number,
      r = 1,
      g = 0.5,
      b = 0.1,
      size = 4,
      life = 25
    ) => {
      if (particles.length >= maxParticles) {
        particles.shift();
      }
      particles.push({
        x,
        y,
        z: 0,
        vx,
        vy,
        vz: (Math.random() - 0.5) * 1.5,
        r,
        g,
        b,
        size,
        life,
        maxLife: life,
      });
    };

    // Click fire burst
    const onMouseDown = (e: MouseEvent) => {
      mouse.recoil = 6.0;
      rocketObj.triggerClickShockwave(e.clientX, e.clientY);

      // Burst of fiery sparks on click
      for (let i = 0; i < 16; i++) {
        const rad = Math.random() * Math.PI * 2;
        const spd = Math.random() * 4.5 + 2.0;
        spawnParticle(
          e.clientX,
          e.clientY,
          Math.cos(rad) * spd,
          Math.sin(rad) * spd,
          1.0,
          0.4 + Math.random() * 0.5,
          0.1,
          5.5,
          28
        );
      }
    };

    // Mouse Movement Listener
    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.targetOpacity = 1;
      mouse.lastMoveTime = performance.now();

      // Detect hovered element for interactive rocket behavior
      const targetEl = e.target as HTMLElement | null;
      if (targetEl) {
        const buttonEl = targetEl.closest('button, a, [role="button"], input[type="submit"]');
        const text = buttonEl?.textContent?.toLowerCase() || '';

        if (
          text.includes('order') ||
          text.includes('checkout') ||
          text.includes('cart') ||
          text.includes('buy')
        ) {
          mouse.hoverMode = 'order';
        } else if (buttonEl) {
          mouse.hoverMode = 'button';
        } else if (targetEl.closest('nav, [data-nav], .menu-category-tab')) {
          mouse.hoverMode = 'menu';
        } else if (targetEl.closest('.food-card, [data-food-card], article')) {
          mouse.hoverMode = 'food';
        } else {
          mouse.hoverMode = 'default';
        }
      }
    };

    // Fade out when cursor leaves window
    const onMouseLeave = () => {
      mouse.targetOpacity = 0;
    };

    const onMouseEnter = () => {
      mouse.targetOpacity = 1;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Resize Handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.right = width;
      camera.top = height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 6. Ultra-Smooth 120 FPS Main Render Loop
    let animId: number;

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);

      // Low latency Lerp for cursor position (Factor = 0.42 for instantaneous feel without jitter)
      const dx = mouse.targetX - mouse.currX;
      const dy = mouse.targetY - mouse.currY;
      mouse.currX += dx * 0.42;
      mouse.currY += dy * 0.42;

      // Calculate instantaneous velocity & speed
      mouse.vx = mouse.currX - mouse.prevX;
      mouse.vy = mouse.currY - mouse.prevY;
      mouse.speed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
      mouse.prevX = mouse.currX;
      mouse.prevY = mouse.currY;

      // Handle idle vs movement states
      const timeSinceMove = performance.now() - mouse.lastMoveTime;
      mouse.isMoving = timeSinceMove < 120 && mouse.speed > 0.6;

      if (mouse.isMoving) {
        // Automatically orient pointed nose towards direction of mouse travel
        // In screen coords, positive Y is downwards, so angle = Math.atan2(dy, dx) - Math.PI/2
        const travelAngle = Math.atan2(mouse.vy, mouse.vx) + Math.PI / 2;
        
        let angleDiff = travelAngle - mouse.angle;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        mouse.angle += angleDiff * 0.22;

        // Dynamic 3D Banking & Tilting (roll into horizontal turns)
        const targetRoll = -Math.max(-0.65, Math.min(0.65, mouse.vx * 0.05));
        const targetPitch = Math.max(-0.4, Math.min(0.4, mouse.vy * 0.04));
        mouse.roll = THREE.MathUtils.lerp(mouse.roll, targetRoll, 0.18);
        mouse.pitch = THREE.MathUtils.lerp(mouse.pitch, targetPitch, 0.18);

        // Spawn exhaust particles from rocket nozzle
        // Nozzle is ~32px behind nose tip along current angle
        const nozzleDist = 32;
        const nozzleX = mouse.currX - Math.sin(mouse.angle) * nozzleDist;
        const nozzleY = mouse.currY + Math.cos(mouse.angle) * nozzleDist;

        if (Math.random() < 0.85) {
          const spread = (Math.random() - 0.5) * 3.5;
          const pushBack = -(mouse.speed * 0.35 + 2.0);
          const pVx = Math.sin(mouse.angle) * pushBack + spread;
          const pVy = -Math.cos(mouse.angle) * pushBack + spread;

          let r = 1.0, g = 0.5, b = 0.1;
          if (mouse.hoverMode === 'food') {
            // Golden foodie sparks
            r = 0.98; g = 0.8; b = 0.2;
          } else if (mouse.hoverMode === 'order') {
            // Energetic cyan/red flame
            r = 1.0; g = 0.2; b = 0.3;
          }

          spawnParticle(nozzleX, nozzleY, pVx, pVy, r, g, b, 3.8, 22);
        }
      } else {
        // Return gracefully to pointer arrow angle (~-45 degrees, top-left)
        const idleAngle = -Math.PI / 4;
        let idleDiff = idleAngle - mouse.angle;
        while (idleDiff < -Math.PI) idleDiff += Math.PI * 2;
        while (idleDiff > Math.PI) idleDiff -= Math.PI * 2;
        mouse.angle += idleDiff * 0.08;

        // Subtle floating bob
        mouse.roll = THREE.MathUtils.lerp(mouse.roll, Math.sin(performance.now() * 0.004) * 0.15, 0.08);
        mouse.pitch = THREE.MathUtils.lerp(mouse.pitch, 0, 0.08);

        // Occasional gentle idling spark
        if (Math.random() < 0.1) {
          const nozzleDist = 32;
          const nozzleX = mouse.currX - Math.sin(mouse.angle) * nozzleDist;
          const nozzleY = mouse.currY + Math.cos(mouse.angle) * nozzleDist;
          spawnParticle(nozzleX, nozzleY, (Math.random() - 0.5) * 1, (Math.random() - 0.5) * 1, 1, 0.6, 0.2, 3, 16);
        }
      }

      // Smooth opacity fade
      mouse.opacity = THREE.MathUtils.lerp(mouse.opacity, mouse.targetOpacity, 0.15);
      container.style.opacity = String(mouse.opacity);

      // Apply Recoil bounce
      mouse.recoil = THREE.MathUtils.lerp(mouse.recoil, 0, 0.15);

      // Update 3D Rocket Root Transform
      // Nose tip is precisely at (mouse.currX, mouse.currY)
      rocketObj.rocketRoot.position.set(
        mouse.currX,
        mouse.currY,
        10
      );

      // Rocket Orientation:
      // Three.js 2D rotation around Z axis + 3D Roll/Pitch
      rocketObj.rocketRoot.rotation.z = -mouse.angle;
      rocketObj.rocketRoot.rotation.y = mouse.roll;
      rocketObj.rocketRoot.rotation.x = mouse.pitch;

      // Update dynamic engine flame & light based on speed and hoverMode
      const speedNorm = Math.min(2.5, mouse.speed * 0.15);
      rocketObj.updateFlameAndLight(speedNorm, mouse.hoverMode);

      // Update Particle Positions & Fading
      const posArr = particleGeometry.attributes.position.array as Float32Array;
      const colArr = particleGeometry.attributes.color.array as Float32Array;

      for (let i = 0; i < maxParticles; i++) {
        if (i < particles.length) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
          p.life--;

          posArr[i * 3] = p.x;
          posArr[i * 3 + 1] = p.y;
          posArr[i * 3 + 2] = p.z;

          const progress = 1 - p.life / p.maxLife;
          // Fade to red/smoke as it dies
          colArr[i * 3] = p.r * (1 - progress * 0.4);
          colArr[i * 3 + 1] = p.g * (1 - progress * 0.7);
          colArr[i * 3 + 2] = p.b * (1 - progress * 0.8);

          if (p.life <= 0) {
            particles.splice(i, 1);
          }
        } else {
          posArr[i * 3] = -9999;
          posArr[i * 3 + 1] = -9999;
        }
      }

      particleGeometry.attributes.position.needsUpdate = true;
      particleGeometry.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };

    renderLoop();

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('resize', handleResize);
      document.documentElement.classList.remove('has-3d-rocket-cursor');

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      rocketObj.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, [fxEnabled, isTouchDevice, isReducedMotion]);

  // Toggle button handler
  const toggleFx = () => {
    setFxEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('food_rocket_3d_cursor_enabled', String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  return (
    <>
      {/* 3D WebGL Canvas Overlay for Real 3D Metallic Rocket Cursor */}
      {fxEnabled && !isTouchDevice && !isReducedMotion && (
        <div
          ref={containerRef}
          className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden select-none transition-opacity duration-300"
          style={{ width: '100vw', height: '100vh' }}
        />
      )}

      {/* Floating 3D Rocket Cursor FX Badge */}
      <div className="fixed bottom-4 left-4 z-[9985] group hidden sm:block">
        <button
          type="button"
          onClick={toggleFx}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-black backdrop-blur-md border shadow-xl transition-all cursor-pointer ${
            fxEnabled && !isTouchDevice
              ? 'bg-slate-900/90 hover:bg-slate-900 text-amber-300 border-red-500/60 shadow-orange-950/40'
              : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 border-slate-700 shadow-black/30'
          }`}
          title="Toggle 3D Metallic Rocket Mouse Cursor"
        >
          <span className={`text-xs ${fxEnabled ? 'animate-bounce' : ''}`}>🚀</span>
          <span>3D Cursor: {fxEnabled && !isTouchDevice ? 'ACTIVE' : 'OFF'}</span>
          <span
            className={`w-2 h-2 rounded-full ${
              fxEnabled && !isTouchDevice ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
            }`}
          />
        </button>
      </div>

      {/* Global CSS to replace default pointer on desktop while preserving interactive clicks */}
      <style>{`
        html.has-3d-rocket-cursor,
        html.has-3d-rocket-cursor body,
        html.has-3d-rocket-cursor * {
          cursor: none !important;
        }
        @media (pointer: coarse), (hover: none) {
          html.has-3d-rocket-cursor,
          html.has-3d-rocket-cursor body,
          html.has-3d-rocket-cursor * {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
};
