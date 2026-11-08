import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Orbit, 
  Sparkles, 
  ShoppingBag, 
  ChevronRight, 
  Layers, 
  Flame, 
  Clock, 
  SlidersHorizontal,
  RotateCw
} from 'lucide-react';
import { Category, FoodItem } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

interface FoodGalaxyProps {
  onQuickView?: (item: FoodItem) => void;
  onCustomize?: (item: FoodItem) => void;
  onNavigate?: (page: string, params?: any) => void;
}

interface PlanetSpec {
  id: string;
  categorySlug: string;
  planetName: string;
  tagline: string;
  color: number;
  emissive: number;
  hasRing: boolean;
  ringColor?: number;
  icon: string;
  ambientLightColor: number;
}

export const FoodGalaxy: React.FC<FoodGalaxyProps> = ({ 
  onQuickView, 
  onCustomize,
  onNavigate 
}) => {
  const { addToCart, setIsCartOpen } = useCart();
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedPlanetIndex, setSelectedPlanetIndex] = useState<number>(0);
  const [planetDishes, setPlanetDishes] = useState<FoodItem[]>([]);
  const [loadingDishes, setLoadingDishes] = useState<boolean>(false);
  const [addedItemId, setAddedItemId] = useState<number | null>(null);

  // The 6 Cosmic Food Planets
  const planets: PlanetSpec[] = [
    {
      id: 'biryani',
      categorySlug: 'rice-biryani',
      planetName: 'Planet Biryani',
      tagline: 'Royal Slow-Dum Basmati Worlds',
      color: 0xf59e0b,
      emissive: 0xb45309,
      hasRing: true,
      ringColor: 0xfde047,
      icon: '👑',
      ambientLightColor: 0xf59e0b,
    },
    {
      id: 'tandoor',
      categorySlug: 'starters',
      planetName: 'Planet Tandoor',
      tagline: '1,000°F Clay Smoked Kebabs & Tikkas',
      color: 0xef4444,
      emissive: 0x991b1b,
      hasRing: false,
      icon: '🔥',
      ambientLightColor: 0xef4444,
    },
    {
      id: 'curries',
      categorySlug: 'main-course',
      planetName: 'Planet Gravy Core',
      tagline: 'Velvety Butter & Heritage Masala Oceans',
      color: 0xea580c,
      emissive: 0x7c2d12,
      hasRing: true,
      ringColor: 0xf97316,
      icon: '🍛',
      ambientLightColor: 0xea580c,
    },
    {
      id: 'burgers',
      categorySlug: 'fast-food',
      planetName: 'Planet Gourmet Crunch',
      tagline: 'Ultra-Crispy Chicken & Brioche Atmosphere',
      color: 0xd97706,
      emissive: 0x92400e,
      hasRing: false,
      icon: '🍔',
      ambientLightColor: 0xfbbf24,
    },
    {
      id: 'combos',
      categorySlug: 'special-combos',
      planetName: 'Planet Feasting Titan',
      tagline: 'Colossal Royal Feasts & Family Banquets',
      color: 0x8b5cf6,
      emissive: 0x5b21b6,
      hasRing: true,
      ringColor: 0xa78bfa,
      icon: '🍱',
      ambientLightColor: 0x8b5cf6,
    },
    {
      id: 'desserts',
      categorySlug: 'desserts',
      planetName: 'Planet Elixir & Sweet',
      tagline: 'Saffron Gulab Jamun & Chilled Shakes',
      color: 0xec4899,
      emissive: 0x9d174d,
      hasRing: false,
      icon: '🍨',
      ambientLightColor: 0xf472b6,
    },
  ];

  // Fetch Categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.getCategories();
        if (res.success && res.categories) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.error('Galaxy categories error:', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch Dishes for the currently active Planet
  useEffect(() => {
    const fetchDishes = async () => {
      setLoadingDishes(true);
      try {
        const activePlanet = planets[selectedPlanetIndex];
        const res = await api.getFoodItems({ category: activePlanet.categorySlug });
        if (res.success && res.items) {
          setPlanetDishes(res.items);
        }
      } catch (err) {
        console.error('Galaxy dishes error:', err);
      } finally {
        setLoadingDishes(false);
      }
    };
    fetchDishes();
  }, [selectedPlanetIndex]);

  // Three.js 3D Cosmic Planet Canvas
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Deep Space Background Stars
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 35;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.7 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Planet Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 3.5);
    sunLight.position.set(10, 8, 10);
    scene.add(sunLight);

    const rimPointLight = new THREE.PointLight(planets[selectedPlanetIndex].ambientLightColor, 3.0, 15);
    rimPointLight.position.set(-6, -4, 2);
    scene.add(rimPointLight);

    // Planet Mesh Group
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    // Central Sphere (The Food Planet)
    const activePlanet = planets[selectedPlanetIndex];
    const planetGeo = new THREE.SphereGeometry(2.3, 48, 48);
    const planetMat = new THREE.MeshStandardMaterial({
      color: activePlanet.color,
      emissive: activePlanet.emissive,
      emissiveIntensity: 0.35,
      roughness: 0.45,
      metalness: 0.2,
    });
    const planetMesh = new THREE.Mesh(planetGeo, planetMat);
    planetGroup.add(planetMesh);

    // Atmospheric Glow Halo
    const atmosphereGeo = new THREE.SphereGeometry(2.45, 32, 32);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: activePlanet.color,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    planetGroup.add(atmosphereMesh);

    // Optional Planetary Rings
    let ringMesh: THREE.Mesh | null = null;
    if (activePlanet.hasRing && activePlanet.ringColor) {
      const ringGeo = new THREE.RingGeometry(3.0, 4.2, 48);
      const ringMat = new THREE.MeshStandardMaterial({
        color: activePlanet.ringColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
        roughness: 0.3,
      });
      ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.5;
      ringMesh.rotation.y = 0.2;
      planetGroup.add(ringMesh);
    }

    // Orbiting Mini Delivery Rocket Drone
    const droneGroup = new THREE.Group();
    const droneGeo = new THREE.ConeGeometry(0.18, 0.6, 12);
    droneGeo.rotateZ(Math.PI / 2);
    const droneMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.1 });
    const drone = new THREE.Mesh(droneGeo, droneMat);
    droneGroup.add(drone);
    scene.add(droneGroup);

    // Interactive Drag to Rotate Planet
    let isDragging = false;
    let prevX = 0;
    let targetRotY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - prevX;
        targetRotY += dx * 0.008;
        prevX = e.clientX;
      }
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth rotate planet with drag and idle drift
      planetGroup.rotation.y = THREE.MathUtils.lerp(
        planetGroup.rotation.y,
        targetRotY + elapsed * 0.12,
        0.05
      );

      // Orbit delivery drone
      const droneRadius = 3.8;
      droneGroup.position.set(
        Math.cos(elapsed * 0.8) * droneRadius,
        Math.sin(elapsed * 0.5) * 0.9,
        Math.sin(elapsed * 0.8) * droneRadius
      );
      droneGroup.rotation.y = -elapsed * 0.8;

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
      planetGeo.dispose();
      planetMat.dispose();
      atmosphereGeo.dispose();
      atmosphereMat.dispose();
      if (ringMesh) {
        ringMesh.geometry.dispose();
        (ringMesh.material as THREE.Material).dispose();
      }
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
    };
  }, [selectedPlanetIndex]);

  const handleAddToCart = (dish: FoodItem) => {
    addToCart(dish, 1);
    setAddedItemId(dish.id);
    setIsCartOpen(true);
    setTimeout(() => setAddedItemId(null), 2500);
  };

  const currentPlanet = planets[selectedPlanetIndex];

  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-28 border-y border-orange-500/30">
      
      {/* Background Star Nebulae */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-900/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-orange-900/25 rounded-full blur-3xl animate-pulse duration-[7000ms]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 via-orange-500/20 to-amber-500/20 border border-purple-500/40 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-amber-300 mb-4 shadow-lg shadow-purple-950/40">
            <Orbit className="w-4 h-4 text-purple-400 animate-spin" />
            <span>Food Galaxy 3D Explorer</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Explore Dishes by{' '}
            <span className="bg-gradient-to-r from-purple-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              Cosmic Food Planets
            </span>
          </h2>

          <p className="mt-3 text-slate-300 text-sm sm:text-base font-normal">
            Every category is its own planetary atmosphere. Rotate the 3D celestial planet to discover signature hand-crafted delicacies.
          </p>
        </div>

        {/* 🪐 PLANET NAVIGATION BAR */}
        <div className="flex items-center justify-start sm:justify-center gap-3 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {planets.map((p, idx) => {
            const isActive = selectedPlanetIndex === idx;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPlanetIndex(idx)}
                className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-slate-900 to-slate-800 border-amber-400 text-white shadow-xl shadow-orange-950/60 ring-2 ring-amber-400/50 scale-105'
                    : 'bg-slate-950/70 hover:bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-xl">{p.icon}</span>
                <div className="text-left">
                  <span className="text-xs font-black block text-white">{p.planetName}</span>
                  <span className="text-[10px] text-slate-400 block line-clamp-1">{p.categorySlug}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 🌌 MAIN PLANETARY EXPLORER SHOWCASE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: 3D Celestial Planet Stage (5 Columns) */}
          <div className="lg:col-span-5 relative h-[360px] sm:h-[440px] rounded-3xl bg-radial from-slate-900 via-slate-950 to-black border border-slate-800/80 shadow-2xl overflow-hidden flex flex-col justify-between p-5">
            
            {/* Top Telemetry */}
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 z-10">
              <span className="bg-slate-900/90 px-3 py-1 rounded-lg border border-slate-800 text-amber-300">
                COORDINATES: {currentPlanet.planetName.toUpperCase()}
              </span>
              <span className="text-emerald-400 animate-pulse">● 3D ORBIT LOCKED</span>
            </div>

            {/* Three.js 3D Canvas */}
            <div ref={canvasRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

            {/* Bottom Planet Info */}
            <div className="relative z-10 bg-slate-950/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
              <div>
                <h4 className="text-base font-black text-white">{currentPlanet.planetName}</h4>
                <p className="text-xs text-amber-300/90">{currentPlanet.tagline}</p>
              </div>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <RotateCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>Drag to Rotate</span>
              </span>
            </div>
          </div>

          {/* Right: Discovered Dishes on this Planet (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  Planetary Delicacies
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  Handcrafted on {currentPlanet.planetName}
                </h3>
              </div>

              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('menu', { category: currentPlanet.categorySlug })}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Full Category</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dishes Grid */}
            {loadingDishes ? (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mb-3" />
                <p className="text-xs font-bold text-slate-400">Scanning planetary orbit...</p>
              </div>
            ) : planetDishes.length === 0 ? (
              <div className="p-8 bg-slate-900/60 rounded-3xl border border-slate-800 text-center">
                <p className="text-slate-400 text-sm">Dishes landing soon on this planet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {planetDishes.slice(0, 4).map((dish) => (
                  <div
                    key={dish.id}
                    className="group bg-slate-900/90 hover:bg-slate-850 rounded-2xl p-4 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between shadow-lg"
                  >
                    <div className="flex gap-3">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-950">
                        <img
                          src={dish.image_url || '/food-rocket-logo.png'}
                          alt={dish.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <span className={`absolute top-1 left-1 w-2 h-2 rounded-full ${dish.is_veg ? 'bg-emerald-400' : 'bg-red-400'}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black text-white group-hover:text-amber-400 transition-colors truncate">
                          {dish.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                          {dish.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-mono">
                          <span className="flex items-center gap-0.5 text-amber-300">
                            ★ {dish.rating || 4.9}
                          </span>
                          <span>•</span>
                          <span>{dish.preparation_time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-base font-black text-white">
                        ₹{dish.discount_price && dish.discount_price > 0 ? dish.discount_price : dish.price}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {onCustomize && (
                          <button
                            type="button"
                            onClick={() => onCustomize(dish)}
                            className="text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                          >
                            Custom
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleAddToCart(dish)}
                          className="text-[11px] font-black bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-3.5 py-1.5 rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>{addedItemId === dish.id ? 'Added!' : 'Add'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
