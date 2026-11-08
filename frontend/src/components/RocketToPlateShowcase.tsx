import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
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
  Move3d,
  Layers,
  Video,
  Download,
  Eye,
  X,
  CheckCircle2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { FoodItem } from '../types';
import { create3DRocket, create3DPlateAndChicken } from '../utils/threeRocketModel';

interface RocketToPlateShowcaseProps {
  onNavigate: (page: string, params?: any) => void;
}

export const RocketToPlateShowcase: React.FC<RocketToPlateShowcaseProps> = ({ onNavigate }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  // Animation Stages: 'ready' -> 'launching' -> 'blasting' -> 'chicken_revealed'
  const [stage, setStage] = useState<'ready' | 'launching' | 'blasting' | 'chicken_revealed'>('ready');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [hasLandedOnce, setHasLandedOnce] = useState<boolean>(false);
  const [autoOrdered, setAutoOrdered] = useState<boolean>(false);

  // 4K Video Recording & Modal State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [show4KModal, setShow4KModal] = useState<boolean>(false);

  // References to 3D scene objects to manipulate in animation loops
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rocketGroupRef = useRef<THREE.Group | null>(null);
  const chickenGroupRef = useRef<THREE.Group | null>(null);
  const plateGroupRef = useRef<THREE.Group | null>(null);
  const steamRef = useRef<(() => void) | null>(null);
  const updateFlameRef = useRef<((speed?: number) => void) | null>(null);

  // Audio Context
  const audioCtxRef = useRef<AudioContext | null>(null);

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

  const playLaunchSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.3);
    } catch (e) {
      console.warn(e);
    }
  };

  const playBlastSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.6, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);

      // Noise crackle
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
      console.warn(e);
    }
  };

  const playTriumphSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5];
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
      console.warn(e);
    }
  };

  // 3D Scene Initialization
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.8, 11);
    camera.lookAt(0, 0.4, 0);
    cameraRef.current = camera;

    // 2. High Quality WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Realistic Studio & Space Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 3.2);
    keyLight.position.set(6, 10, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf97316, 2.0);
    rimLight.position.set(-8, 5, -6);
    scene.add(rimLight);

    const bottomGlow = new THREE.PointLight(0xfbbf24, 1.2, 8);
    bottomGlow.position.set(0, 0.5, 0);
    scene.add(bottomGlow);

    // 4. Create 3D Plate & Chicken
    const { sceneGroup: platterScene, chickenGroup, plateGroup, updateSteam } = create3DPlateAndChicken();
    platterScene.position.set(0, -1.8, 0);
    scene.add(platterScene);
    chickenGroupRef.current = chickenGroup;
    plateGroupRef.current = plateGroup;
    steamRef.current = updateSteam;

    // Initially hide chicken until blast
    chickenGroup.scale.set(0.001, 0.001, 0.001);

    // 5. Create 3D Big Rocket (with twin side boosters)
    const { rocketGroup, updateFlame } = create3DRocket(true);
    rocketGroup.position.set(0, 4.8, 0);
    rocketGroup.scale.set(0.9, 0.9, 0.9);
    scene.add(rocketGroup);
    rocketGroupRef.current = rocketGroup;
    updateFlameRef.current = updateFlame;

    // Mouse Interaction for 3D Orbit / Tilt
    let isDragging = false;
    let prevMouseX = 0;
    let targetRotationY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const delta = e.clientX - prevMouseX;
        targetRotationY += delta * 0.008;
        prevMouseX = e.clientX;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Handle Window Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Main 3D Render Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth rotate platter scene with user drag or idle rotation
      if (platterScene) {
        platterScene.rotation.y = THREE.MathUtils.lerp(
          platterScene.rotation.y,
          targetRotationY + (isDragging ? 0 : Math.sin(elapsed * 0.5) * 0.2),
          0.05
        );
      }

      // Update steam particles when chicken is visible
      if (steamRef.current) {
        steamRef.current();
      }

      // Rocket Hover / Animation during 'ready' stage
      if (rocketGroupRef.current && updateFlameRef.current) {
        updateFlameRef.current(1.0);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Launch Sequence
  const launchRocket = () => {
    if (stage === 'launching' || stage === 'blasting') return;

    setStage('launching');
    playLaunchSound();

    const rocket = rocketGroupRef.current;
    const chicken = chickenGroupRef.current;
    const camera = cameraRef.current;

    if (!rocket || !chicken) return;

    // Reset positions
    rocket.position.set(0, 6.2, 0);
    rocket.rotation.set(Math.PI, 0, 0); // Point downwards towards plate
    rocket.visible = true;
    chicken.scale.set(0.001, 0.001, 0.001);

    // 1. DIVE TO PLATE ANIMATION (1.3 seconds)
    const startTime = performance.now();
    const startY = 6.2;
    const targetY = -1.5; // Surface of the platter
    const duration = 1300;

    const diveInterval = requestAnimationFrame(function dive(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease in cubic acceleration
      const ease = Math.pow(progress, 2.5);

      rocket.position.y = startY + (targetY - startY) * ease;
      rocket.rotation.y += 0.05; // Spin on descent axis

      // Camera dynamic tilt
      if (camera) {
        camera.position.y = 3.8 - ease * 0.8;
      }

      if (updateFlameRef.current) {
        updateFlameRef.current(1.8);
      }

      if (progress < 1) {
        requestAnimationFrame(dive);
      } else {
        // IMPACT & BLAST!
        triggerBlast();
      }
    });
  };

  // Blast and Chicken Reveal Trigger
  const triggerBlast = () => {
    setStage('blasting');
    playBlastSound();

    const rocket = rocketGroupRef.current;
    const chicken = chickenGroupRef.current;
    const camera = cameraRef.current;

    // Hide rocket instantly into the blast
    if (rocket) rocket.visible = false;

    // Screen Shake & Camera Recoil
    if (camera) {
      camera.position.y += 0.3;
      setTimeout(() => {
        if (camera) camera.position.set(0, 3.8, 11);
      }, 400);
    }

    // Confetti Fireworks Blast!
    try {
      confetti({
        particleCount: 85,
        spread: 90,
        origin: { y: 0.65 },
        colors: ['#f97316', '#fbbf24', '#ef4444', '#16a34a', '#ffffff'],
      });
    } catch (e) {
      console.warn(e);
    }

    // Chicken Pops Out of the Smoke after 550ms!
    setTimeout(() => {
      setStage('chicken_revealed');
      setHasLandedOnce(true);
      playTriumphSound();

      if (chicken) {
        // Animate chicken scale pop
        let scale = 0.01;
        const popAnim = setInterval(() => {
          scale += 0.08;
          if (scale >= 1.0) {
            scale = 1.0;
            clearInterval(popAnim);
          }
          chicken.scale.set(scale, scale, scale);
        }, 16);
      }
    }, 550);
  };

  // Quick auto-trigger on initial scroll if not yet landed
  useEffect(() => {
    const timer = setTimeout(() => {
      if (stage === 'ready' && !hasLandedOnce) {
        launchRocket();
      }
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

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

  // 4K 120 FPS Native WebGL Master Video Exporter
  const record4K120FPSVideo = async () => {
    const canvas = canvasContainerRef.current?.querySelector('canvas');
    if (!canvas) return;

    try {
      setIsRecording(true);
      setRecordingSeconds(0);

      // 120 FPS high framerate capture stream
      const stream = (canvas as any).captureStream
        ? (canvas as any).captureStream(120)
        : (canvas as any).mozCaptureStream
        ? (canvas as any).mozCaptureStream(120)
        : null;

      if (!stream) {
        alert('Canvas recording is not supported in this browser.');
        setIsRecording(false);
        return;
      }

      // High-bitrate 50 Mbps 4K Master codec selection
      const mimeTypes = [
        'video/mp4;codecs=avc1',
        'video/mp4',
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp9',
        'video/webm'
      ];
      const selectedMime = mimeTypes.find((t) => MediaRecorder.isTypeSupported(t)) || 'video/webm';

      const recorder = new MediaRecorder(stream, {
        mimeType: selectedMime,
        videoBitsPerSecond: 50000000, // 50 Mbps ultra-high bitrate
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const isMp4 = selectedMime.includes('mp4');
        const ext = isMp4 ? 'mp4' : 'webm';
        const blob = new Blob(chunks, { type: selectedMime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `FoodRocket_4K_120FPS_Master.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsRecording(false);
      };

      recorder.start();

      // Trigger the 3D rocket descent & blast sequence
      launchRocket();

      const startTime = Date.now();
      const recordTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setRecordingSeconds(elapsed);
        if (elapsed >= 9) {
          clearInterval(recordTimer);
          if (recorder.state !== 'inactive') {
            recorder.stop();
          }
        }
      }, 1000);
    } catch (err) {
      console.error('Recording error:', err);
      setIsRecording(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 sm:py-24 border-y border-orange-500/30">
      
      {/* 3D Cosmic Background Lights */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-orange-600/25 rounded-full blur-3xl animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-pulse duration-[10000ms]" />
        <div className="absolute inset-0 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/25 via-amber-500/25 to-emerald-500/25 border border-orange-500/40 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-amber-300 mb-4 shadow-lg shadow-orange-950/40">
            <Move3d className="w-4 h-4 text-amber-400 animate-spin" />
            <span>Interactive 3D Rocket Delivery Arena</span>
            <span className="text-sm">🚀💥🍗</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Watch Our <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">3D Rocket Blast</span>{' '}
            Onto Your Plate!
          </h2>

          <p className="mt-3 text-slate-300 text-sm sm:text-base font-normal">
            Real-time 3D WebGL physics: Watch the rocket dive from orbit and blast piping hot, succulent roast chicken right onto the chrome serving platter! (Click & drag to rotate in 3D).
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="inline-flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white px-3 py-1 rounded-full text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sound: ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sound: MUTED</span>
                </>
              )}
            </button>

            {/* 4K 120 FPS Video Exporter Button */}
            <button
              type="button"
              disabled={isRecording}
              onClick={record4K120FPSVideo}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold border shadow-md transition-all cursor-pointer ${
                isRecording
                  ? 'bg-red-600/90 text-white border-red-400 animate-pulse'
                  : 'bg-gradient-to-r from-red-950/80 to-slate-900 hover:from-red-900/90 hover:to-slate-850 text-red-300 border-red-500/50 hover:border-red-400'
              }`}
              title="Record and export 4K 120 FPS Master MP4/WebM"
            >
              <Video className="w-3.5 h-3.5 text-red-400" />
              <span>{isRecording ? `Recording 4K 120FPS (${recordingSeconds}s / 9s)...` : 'Export 4K 120FPS Master Video'}</span>
            </button>

            {/* 4K Photorealistic Master Shot Preview Button */}
            <button
              type="button"
              onClick={() => setShow4KModal(true)}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer"
              title="View Ultra-Realistic 4K UHD Photorealistic Master Render"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>View 4K UHD Photorealistic Master</span>
            </button>

            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Move3d className="w-3.5 h-3.5 text-amber-400" />
              <span>Drag canvas to rotate 3D view</span>
            </span>
          </div>
        </div>

        {/* 🎬 3D WEBGL ARENA CONTAINER */}
        <div className="relative mx-auto max-w-4xl h-[480px] sm:h-[540px] rounded-3xl bg-radial from-slate-900 via-slate-950 to-black border-2 border-orange-500/50 shadow-2xl shadow-orange-950/80 overflow-hidden flex flex-col justify-between p-5 select-none">
          
          {/* Top Telemetry HUD */}
          <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 z-20">
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400">3D WEBGL ENGINE: ACTIVE</span>
            </div>

            <div className="bg-slate-900/90 border border-orange-500/40 px-3 py-1 rounded-lg text-amber-300 flex items-center gap-1.5">
              <span>STATUS:</span>
              <span className="font-extrabold text-white">
                {stage === 'ready' && '🚀 3D ROCKET PERCHED IN ORBIT'}
                {stage === 'launching' && '⚡ SUPERSONIC 3D DESCENT'}
                {stage === 'blasting' && '💥 3D IMPACT & TASTE BLAST!'}
                {stage === 'chicken_revealed' && '🍗 3D STEAMING CHICKEN ON PLATTER!'}
              </span>
            </div>
          </div>

          {/* 3D Canvas Mount Point */}
          <div
            ref={canvasContainerRef}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10"
          />

          {/* Comic Blast Burst (HTML Overlay during 'blasting') */}
          {stage === 'blasting' && (
            <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center animate-in zoom-in-50 duration-200">
              <div className="relative flex flex-col items-center">
                <div className="absolute -inset-16 rounded-full border-4 border-amber-400 bg-orange-600/30 animate-ping duration-500" />
                <svg width="240" height="160" viewBox="0 0 220 150" className="animate-bounce drop-shadow-2xl">
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
            </div>
          )}

          {/* Golden Chicken Landed Badge Overlay */}
          {stage === 'chicken_revealed' && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center animate-in fade-in zoom-in duration-300">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-black text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-2xl border border-emerald-400/60">
                <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>3D CHICKEN LANDED FRESH & STEAMING!</span>
                <span className="text-amber-300">⚡ 0.8s</span>
              </div>
            </div>
          )}

          {/* Bottom Control Bar */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 bg-slate-950/70 backdrop-blur-md rounded-2xl px-4 py-2.5">
            <div className="flex items-center gap-3">
              {stage === 'chicken_revealed' ? (
                <button
                  type="button"
                  onClick={launchRocket}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-orange-600/30 transition-all cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>🚀 Launch 3D Rocket Again!</span>
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
                    {stage === 'launching' ? '3D ROCKET DIVING...' : stage === 'blasting' ? '💥 IMPACT!' : '🚀 LAUNCH 3D ROCKET TO PLATE!'}
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
                onClick={() => onNavigate('menu', { category: 'rice-biryani' })}
                className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Browse Signature Chicken Menu</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 4K UHD PHOTOREALISTIC MASTER CINE-MODAL */}
      {show4KModal && (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-slate-900 border-2 border-orange-500/60 rounded-3xl overflow-hidden shadow-2xl shadow-orange-950/80 flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="text-base sm:text-lg font-black text-white">
                  Food Rocket 4K UHD Photorealistic Master Render
                </h3>
                <span className="text-xs bg-orange-500/20 text-orange-400 font-extrabold px-2.5 py-0.5 rounded-full border border-orange-500/30">
                  3840 × 2160 • 120 FPS Master
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShow4KModal(false)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal 4K Image Visual */}
            <div className="relative flex-1 overflow-auto bg-black flex items-center justify-center p-2 sm:p-4">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 group">
                <img
                  src="/food-rocket-4k-render.jpg"
                  alt="Food Rocket 4K Photorealistic Master Landing"
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-300 border border-amber-400/40">
                  <span>🎥 4K UHD 16:9 MASTER</span>
                </div>
              </div>
            </div>

            {/* Modal Footer Specs & Actions */}
            <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="bg-slate-800 px-2.5 py-1 rounded-md font-mono text-emerald-400">✓ Native 4K UHD (3840×2160)</span>
                <span className="bg-slate-800 px-2.5 py-1 rounded-md font-mono text-amber-300">✓ 120 FPS Native Render</span>
                <span className="bg-slate-800 px-2.5 py-1 rounded-md font-mono text-cyan-300">✓ Ray-Traced Reflections</span>
                <span className="bg-slate-800 px-2.5 py-1 rounded-md font-mono text-orange-400">✓ Fluid Smoke & Fire Simulation</span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="/food-rocket-4k-render.jpg"
                  download="FoodRocket_4K_Photorealistic_Master.jpg"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download 4K Master Still (JPG)</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
