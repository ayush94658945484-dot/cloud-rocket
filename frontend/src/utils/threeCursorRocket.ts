import * as THREE from 'three';

export interface CursorRocketInstance {
  rocketRoot: THREE.Group;
  fuselage: THREE.Mesh;
  fins: THREE.Mesh[];
  nozzle: THREE.Mesh;
  flameGroup: THREE.Group;
  outerFlame: THREE.Mesh;
  innerFlame: THREE.Mesh;
  flameLight: THREE.PointLight;
  shockwaves: THREE.Mesh[];
  triggerClickShockwave: (x: number, y: number) => void;
  updateFlameAndLight: (intensity: number, hoverMode: string) => void;
  dispose: () => void;
}

/**
 * Creates a pixel-accurate, ultra-crisp 3D Metallic Rocket cursor.
 * Specifically tuned for an Orthographic Camera where 1 unit = 1 screen pixel.
 * Length: ~36-38px, Width: ~22px across fins.
 * Nose tip is precisely anchored at (0, 0, 0).
 */
export function createCursorRocket(): CursorRocketInstance {
  const rocketRoot = new THREE.Group();

  // 1. PBR METALLIC MATERIALS
  // High-gloss polished silver chrome hull
  const silverChromeMaterial = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.92,
    roughness: 0.15,
  });

  // Attractive Ruby Red Metallic Fins
  const redFinMaterial = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    metalness: 0.65,
    roughness: 0.25,
  });

  // Pointed nose red tip
  const redNoseTipMaterial = new THREE.MeshStandardMaterial({
    color: 0xb91c1c,
    metalness: 0.7,
    roughness: 0.2,
  });

  // Dark titanium engine nozzle
  const titaniumNozzleMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.88,
    roughness: 0.3,
  });

  // Cockpit cyan glass
  const cyanGlassMaterial = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    metalness: 0.3,
    roughness: 0.1,
  });

  // Gold bezel
  const goldBezelMaterial = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.85,
    roughness: 0.2,
  });

  // 2. FUSELAGE HULL
  // Anchored so (0, 0, 0) is the sharp nose tip!
  // Rocket points UP along +Y when rotation = 0, so tip is at (0, 0, 0), body extends along -Y
  const lathePoints: THREE.Vector2[] = [
    new THREE.Vector2(0, 0),           // Sharp needle nose tip
    new THREE.Vector2(1.2, -3),
    new THREE.Vector2(2.8, -7),
    new THREE.Vector2(4.2, -13),
    new THREE.Vector2(4.6, -20),       // Waist
    new THREE.Vector2(4.4, -26),
    new THREE.Vector2(3.5, -29),
    new THREE.Vector2(2.5, -30.5),     // Base socket
    new THREE.Vector2(0, -30.5),
  ];

  const fuselageGeo = new THREE.LatheGeometry(lathePoints, 24);
  const fuselage = new THREE.Mesh(fuselageGeo, silverChromeMaterial);
  fuselage.castShadow = true;
  rocketRoot.add(fuselage);

  // Red aerodynamic needle tip accent
  const tipGeo = new THREE.ConeGeometry(1.6, 4.5, 16);
  tipGeo.rotateX(Math.PI);
  tipGeo.translate(0, -2.25, 0);
  const noseTip = new THREE.Mesh(tipGeo, redNoseTipMaterial);
  rocketRoot.add(noseTip);

  // Cockpit Porthole
  const portholeGroup = new THREE.Group();
  portholeGroup.position.set(0, -11, 4.2);
  portholeGroup.rotation.x = 0.25;

  const bezelGeo = new THREE.TorusGeometry(1.6, 0.4, 12, 24);
  const bezel = new THREE.Mesh(bezelGeo, goldBezelMaterial);
  portholeGroup.add(bezel);

  const glassGeo = new THREE.CircleGeometry(1.5, 20);
  const glass = new THREE.Mesh(glassGeo, cyanGlassMaterial);
  portholeGroup.add(glass);

  rocketRoot.add(portholeGroup);

  // 3. ATTRACTIVE RED DELTA FINS (3 Fins at 120° intervals around fuselage)
  const fins: THREE.Mesh[] = [];
  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(7.5, -9);
  finShape.bezierCurveTo(9.5, -13, 8.5, -15, 5, -15.5);
  finShape.lineTo(0, -11);
  finShape.closePath();

  const finExtrudeSettings = {
    depth: 0.8,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.3,
    bevelThickness: 0.3,
  };
  const finGeo = new THREE.ExtrudeGeometry(finShape, finExtrudeSettings);
  finGeo.center();

  const finAngles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
  finAngles.forEach((angle) => {
    const fin = new THREE.Mesh(finGeo, redFinMaterial);
    fin.position.y = -22;
    fin.rotation.y = angle;
    fin.translateZ(5.5);
    rocketRoot.add(fin);
    fins.push(fin);
  });

  // 4. TITANIUM ENGINE NOZZLE
  const nozzleGeo = new THREE.CylinderGeometry(2.0, 3.2, 3.5, 18);
  const nozzle = new THREE.Mesh(nozzleGeo, titaniumNozzleMaterial);
  nozzle.position.y = -32;
  rocketRoot.add(nozzle);

  // 5. GLOWING ORANGE/YELLOW ENGINE FLAME
  const flameGroup = new THREE.Group();
  flameGroup.position.y = -34;

  // Outer orange translucent flame cone
  const outerFlameGeo = new THREE.ConeGeometry(3.0, 16, 16);
  outerFlameGeo.translate(0, -8, 0);
  const outerFlameMat = new THREE.MeshBasicMaterial({
    color: 0xf97316,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const outerFlame = new THREE.Mesh(outerFlameGeo, outerFlameMat);
  flameGroup.add(outerFlame);

  // Inner yellow superheated core
  const innerFlameGeo = new THREE.ConeGeometry(1.6, 11, 16);
  innerFlameGeo.translate(0, -5.5, 0);
  const innerFlameMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const innerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
  flameGroup.add(innerFlame);

  // Glowing engine point light
  const flameLight = new THREE.PointLight(0xf97316, 2.5, 60);
  flameLight.position.y = -5;
  flameGroup.add(flameLight);

  rocketRoot.add(flameGroup);

  // 6. SHOCKWAVE SYSTEM FOR CLICKS
  const shockwaves: THREE.Mesh[] = [];
  const shockwaveGeo = new THREE.RingGeometry(1, 2.5, 32);
  const shockwaveMat = new THREE.MeshBasicMaterial({
    color: 0xf97316,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });

  for (let i = 0; i < 4; i++) {
    const sw = new THREE.Mesh(shockwaveGeo, shockwaveMat.clone());
    sw.visible = false;
    shockwaves.push(sw);
  }

  let nextShockwave = 0;
  const triggerClickShockwave = (x: number, y: number) => {
    const sw = shockwaves[nextShockwave];
    nextShockwave = (nextShockwave + 1) % shockwaves.length;
    sw.position.set(x, y, 2);
    sw.scale.set(1, 1, 1);
    (sw.material as THREE.MeshBasicMaterial).opacity = 0.95;
    sw.visible = true;

    const startTime = performance.now();
    const anim = () => {
      const elapsed = performance.now() - startTime;
      const progress = elapsed / 350;
      if (progress < 1) {
        const s = 1 + progress * 16;
        sw.scale.set(s, s, 1);
        (sw.material as THREE.MeshBasicMaterial).opacity = 0.95 * (1 - progress);
        requestAnimationFrame(anim);
      } else {
        sw.visible = false;
      }
    };
    requestAnimationFrame(anim);
  };

  // Update Flame function
  const updateFlameAndLight = (speedMultiplier: number, hoverMode: string) => {
    const time = performance.now() * 0.02;
    const pulse = Math.sin(time) * 0.15 + Math.cos(time * 1.7) * 0.1;

    let baseScale = 0.7 + speedMultiplier * 0.6;
    let colorHex = 0xf97316;
    let lightColor = 0xf97316;

    if (hoverMode === 'order') {
      baseScale *= 1.45;
      colorHex = 0xef4444;
      lightColor = 0xf43f5e;
    } else if (hoverMode === 'button') {
      baseScale *= 1.25;
      colorHex = 0xf59e0b;
      lightColor = 0xfbbf24;
    } else if (hoverMode === 'food') {
      baseScale *= 1.15;
      colorHex = 0xfacc15;
      lightColor = 0xfde047;
    } else if (hoverMode === 'menu') {
      baseScale *= 1.1;
      colorHex = 0x38bdf8;
      lightColor = 0x38bdf8;
    }

    const scaleY = Math.max(0.3, (1 + pulse) * baseScale);
    const scaleXZ = Math.max(0.5, (1 + pulse * 0.3) * (0.8 + speedMultiplier * 0.3));

    flameGroup.scale.set(scaleXZ, scaleY, scaleXZ);
    outerFlameMat.color.setHex(colorHex);
    flameLight.color.setHex(lightColor);
    flameLight.intensity = Math.min(5.0, 1.8 + speedMultiplier * 2.2 + pulse);
  };

  const dispose = () => {
    fuselageGeo.dispose();
    silverChromeMaterial.dispose();
    finGeo.dispose();
    redFinMaterial.dispose();
    nozzleGeo.dispose();
    titaniumNozzleMaterial.dispose();
    outerFlameGeo.dispose();
    outerFlameMat.dispose();
    innerFlameGeo.dispose();
    innerFlameMat.dispose();
    shockwaveGeo.dispose();
    shockwaveMat.dispose();
  };

  return {
    rocketRoot,
    fuselage,
    fins,
    nozzle,
    flameGroup,
    outerFlame,
    innerFlame,
    flameLight,
    shockwaves,
    triggerClickShockwave,
    updateFlameAndLight,
    dispose,
  };
}
