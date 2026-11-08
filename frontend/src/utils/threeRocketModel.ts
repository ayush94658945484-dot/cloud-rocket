import * as THREE from 'three';

/**
 * Creates a high-detail, stylized, glossy 3D Rocket Model.
 * @param isBigRocket If true, adds twin side boosters and extra panel detailing.
 */
export function create3DRocket(isBigRocket = false): {
  rocketGroup: THREE.Group;
  thrusterFlame: THREE.Group;
  thrusterLight: THREE.PointLight;
  updateFlame: (speedMultiplier?: number) => void;
} {
  const rocketGroup = new THREE.Group();

  // Materials with realistic PBR gloss
  const whiteHullMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.25,
    metalness: 0.1,
  });

  const orangeTrimMaterial = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.3,
    metalness: 0.15,
  });

  const greenNoseMaterial = new THREE.MeshStandardMaterial({
    color: 0x16a34a,
    roughness: 0.25,
    metalness: 0.2,
  });

  const goldBezelMaterial = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    roughness: 0.2,
    metalness: 0.8,
  });

  const glassWindowMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    roughness: 0.1,
    metalness: 0.1,
    transmission: 0.6,
    transparent: true,
    opacity: 0.85,
    reflectivity: 0.9,
  });

  const darkNozzleMaterial = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.4,
    metalness: 0.8,
  });

  // 1. MAIN FUSELAGE (Smooth aerodynamic curvature)
  const lathePoints: THREE.Vector2[] = [
    new THREE.Vector2(0, 2.2),       // Top tip
    new THREE.Vector2(0.28, 1.9),
    new THREE.Vector2(0.55, 1.4),
    new THREE.Vector2(0.72, 0.7),
    new THREE.Vector2(0.78, 0.0),    // Widest waist
    new THREE.Vector2(0.74, -0.8),
    new THREE.Vector2(0.65, -1.4),
    new THREE.Vector2(0.5, -1.7),
    new THREE.Vector2(0.38, -1.85),  // Base nozzle socket
    new THREE.Vector2(0, -1.85)
  ];
  const fuselageGeo = new THREE.LatheGeometry(lathePoints, 32);
  const fuselage = new THREE.Mesh(fuselageGeo, whiteHullMaterial);
  fuselage.castShadow = true;
  fuselage.receiveShadow = true;
  rocketGroup.add(fuselage);

  // 2. EMERALD GREEN NOSE CONE (Food Rocket Signature)
  const nosePoints: THREE.Vector2[] = [
    new THREE.Vector2(0, 2.22),
    new THREE.Vector2(0.29, 1.9),
    new THREE.Vector2(0.48, 1.55),
    new THREE.Vector2(0, 1.55)
  ];
  const noseGeo = new THREE.LatheGeometry(nosePoints, 32);
  const nose = new THREE.Mesh(noseGeo, greenNoseMaterial);
  rocketGroup.add(nose);

  // 3. VIBRANT ORANGE MIDSECTION BAND
  const bandGeo = new THREE.CylinderGeometry(0.785, 0.775, 0.35, 32, 1, true);
  const band = new THREE.Mesh(bandGeo, orangeTrimMaterial);
  band.position.y = -0.2;
  rocketGroup.add(band);

  // 4. CIRCULAR COCKPIT PORTHOLE
  const portholeGroup = new THREE.Group();
  portholeGroup.position.set(0, 0.65, 0.68);
  portholeGroup.rotation.x = 0.2;

  // Gold bezel ring
  const bezelGeo = new THREE.TorusGeometry(0.25, 0.05, 16, 32);
  const bezel = new THREE.Mesh(bezelGeo, goldBezelMaterial);
  portholeGroup.add(bezel);

  // Cyan glass window
  const glassGeo = new THREE.CircleGeometry(0.24, 32);
  const glass = new THREE.Mesh(glassGeo, glassWindowMaterial);
  portholeGroup.add(glass);

  // Mini mascot chicken / pilot silhouette inside
  const pilotGeo = new THREE.SphereGeometry(0.1, 16, 16);
  const pilotMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
  const pilot = new THREE.Mesh(pilotGeo, pilotMat);
  pilot.position.z = -0.05;
  portholeGroup.add(pilot);

  rocketGroup.add(portholeGroup);

  // 5. AERODYNAMIC CURVED DELTA FINS (3 Fins at 120° intervals)
  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(0.7, -0.6);
  finShape.bezierCurveTo(0.9, -1.0, 0.8, -1.2, 0.5, -1.3);
  finShape.lineTo(0, -0.9);
  finShape.closePath();

  const extrudeSettings = {
    depth: 0.06,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02
  };
  const finGeo = new THREE.ExtrudeGeometry(finShape, extrudeSettings);
  finGeo.center();

  const finAngles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
  finAngles.forEach((angle) => {
    const fin = new THREE.Mesh(finGeo, orangeTrimMaterial);
    fin.position.y = -1.1;
    fin.rotation.y = angle;
    fin.translateZ(0.8);
    fin.castShadow = true;
    rocketGroup.add(fin);
  });

  // 6. MAIN ENGINE NOZZLE
  const nozzleGeo = new THREE.CylinderGeometry(0.28, 0.42, 0.35, 24);
  const nozzle = new THREE.Mesh(nozzleGeo, darkNozzleMaterial);
  nozzle.position.y = -1.95;
  rocketGroup.add(nozzle);

  // 7. OPTIONAL TWIN SIDE BOOSTERS (For Big Rocket)
  if (isBigRocket) {
    const boosterOffsets = [-0.95, 0.95];
    boosterOffsets.forEach((offsetX) => {
      const boosterGroup = new THREE.Group();
      boosterGroup.position.set(offsetX, -0.5, 0);

      // Booster cylinder body
      const bBodyGeo = new THREE.CylinderGeometry(0.22, 0.22, 1.8, 24);
      const bBody = new THREE.Mesh(bBodyGeo, whiteHullMaterial);
      boosterGroup.add(bBody);

      // Booster orange nose cone
      const bNoseGeo = new THREE.ConeGeometry(0.22, 0.6, 24);
      const bNose = new THREE.Mesh(bNoseGeo, orangeTrimMaterial);
      bNose.position.y = 1.2;
      boosterGroup.add(bNose);

      // Booster nozzle
      const bNozzleGeo = new THREE.CylinderGeometry(0.15, 0.22, 0.25, 20);
      const bNozzle = new THREE.Mesh(bNozzleGeo, darkNozzleMaterial);
      bNozzle.position.y = -1.0;
      boosterGroup.add(bNozzle);

      // Strut connector to main hull
      const strutGeo = new THREE.BoxGeometry(Math.abs(offsetX) * 0.4, 0.08, 0.08);
      const strut = new THREE.Mesh(strutGeo, darkNozzleMaterial);
      strut.position.x = -Math.sign(offsetX) * 0.15;
      strut.position.y = 0.2;
      boosterGroup.add(strut);

      rocketGroup.add(boosterGroup);
    });
  }

  // 8. DYNAMIC 3D JET FLAME & GLOW
  const thrusterFlame = new THREE.Group();
  thrusterFlame.position.y = -2.1;

  // Outer orange fire plume
  const outerFlameGeo = new THREE.ConeGeometry(0.42, 1.8, 16);
  outerFlameGeo.translate(0, -0.9, 0);
  const outerFlameMat = new THREE.MeshBasicMaterial({
    color: 0xf97316,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
  const outerFlame = new THREE.Mesh(outerFlameGeo, outerFlameMat);
  thrusterFlame.add(outerFlame);

  // Inner yellow core
  const innerFlameGeo = new THREE.ConeGeometry(0.22, 1.3, 16);
  innerFlameGeo.translate(0, -0.65, 0);
  const innerFlameMat = new THREE.MeshBasicMaterial({
    color: 0xfde047,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
  const innerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
  thrusterFlame.add(innerFlame);

  // Center white hot stinger
  const coreFlameGeo = new THREE.ConeGeometry(0.1, 0.7, 12);
  coreFlameGeo.translate(0, -0.35, 0);
  const coreFlameMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending
  });
  const coreFlame = new THREE.Mesh(coreFlameGeo, coreFlameMat);
  thrusterFlame.add(coreFlame);

  // Dynamic point light emitted from nozzle
  const thrusterLight = new THREE.PointLight(0xf97316, 2.5, 6);
  thrusterLight.position.y = -0.5;
  thrusterFlame.add(thrusterLight);

  rocketGroup.add(thrusterFlame);

  // Update animation function
  const updateFlame = (speedMultiplier = 1) => {
    const time = Date.now() * 0.02;
    const pulse = Math.sin(time) * 0.15 + Math.cos(time * 1.5) * 0.1;
    const scaleY = (1 + pulse) * speedMultiplier;
    const scaleXZ = 1 + pulse * 0.4;
    thrusterFlame.scale.set(scaleXZ, Math.max(0.2, scaleY), scaleXZ);
    thrusterLight.intensity = (2.2 + pulse * 1.5) * speedMultiplier;
  };

  return {
    rocketGroup,
    thrusterFlame,
    thrusterLight,
    updateFlame
  };
}

/**
 * Creates a high-detail 3D Platter and Roasted Golden Chicken model.
 */
export function create3DPlateAndChicken(): {
  sceneGroup: THREE.Group;
  chickenGroup: THREE.Group;
  plateGroup: THREE.Group;
  steamParticles: THREE.Points;
  updateSteam: () => void;
} {
  const sceneGroup = new THREE.Group();

  // 1. CHROME & GOLD LUXURY DINING PLATTER
  const plateGroup = new THREE.Group();

  const silverPlateMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.15,
    metalness: 0.88,
  });

  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.2,
    metalness: 0.85,
  });

  // Base platter dish
  const platterPoints: THREE.Vector2[] = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(1.5, 0.05),
    new THREE.Vector2(2.1, 0.2),
    new THREE.Vector2(2.35, 0.35),
    new THREE.Vector2(2.4, 0.28),
    new THREE.Vector2(2.2, 0.15),
    new THREE.Vector2(1.4, 0),
    new THREE.Vector2(0, 0)
  ];
  const platterGeo = new THREE.LatheGeometry(platterPoints, 48);
  const platter = new THREE.Mesh(platterGeo, silverPlateMat);
  platter.receiveShadow = true;
  plateGroup.add(platter);

  // Gold outer decorative rim
  const rimGeo = new THREE.TorusGeometry(2.32, 0.04, 16, 48);
  rimGeo.rotateX(Math.PI / 2);
  rimGeo.translate(0, 0.35, 0);
  const rim = new THREE.Mesh(rimGeo, goldTrimMat);
  plateGroup.add(rim);

  // Glowing holographic target radar circle on the plate
  const targetRingGeo = new THREE.RingGeometry(1.6, 1.7, 32);
  targetRingGeo.rotateX(-Math.PI / 2);
  targetRingGeo.translate(0, 0.08, 0);
  const targetRingMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.75
  });
  const targetRing = new THREE.Mesh(targetRingGeo, targetRingMat);
  plateGroup.add(targetRing);

  sceneGroup.add(plateGroup);

  // 2. DELICIOUS 3D ROASTED CHICKEN
  const chickenGroup = new THREE.Group();
  chickenGroup.position.y = 0.25;

  const roastedSkinMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    roughness: 0.32,
    metalness: 0.08,
  });

  const darkGlazeMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.28,
    metalness: 0.1,
  });

  const boneMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.4,
    metalness: 0.1,
  });

  const herbMat = new THREE.MeshStandardMaterial({
    color: 0x16a34a,
    roughness: 0.5,
  });

  const lemonMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.3,
  });

  // Plump roasted chicken breast body
  const bodyGeo = new THREE.SphereGeometry(0.85, 32, 24);
  bodyGeo.scale(1.2, 0.75, 0.95);
  const body = new THREE.Mesh(bodyGeo, roastedSkinMat);
  body.castShadow = true;
  chickenGroup.add(body);

  // Upper glazed roasted crest
  const glazeGeo = new THREE.SphereGeometry(0.72, 24, 16);
  glazeGeo.scale(1.1, 0.55, 0.85);
  glazeGeo.translate(0, 0.22, 0);
  const glaze = new THREE.Mesh(glazeGeo, darkGlazeMat);
  chickenGroup.add(glaze);

  // Drumstick legs (Left & Right)
  [-1, 1].forEach((side) => {
    const legGroup = new THREE.Group();
    legGroup.position.set(side * 0.7, 0.1, -0.2);
    legGroup.rotation.set(0.3, side * -0.4, side * -0.3);

    // Drumstick meaty bulb
    const bulbGeo = new THREE.SphereGeometry(0.38, 20, 16);
    bulbGeo.scale(1.0, 1.4, 0.9);
    const bulb = new THREE.Mesh(bulbGeo, roastedSkinMat);
    legGroup.add(bulb);

    // Bone shaft with paper chef frill
    const shaftGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.45, 12);
    shaftGeo.translate(0, 0.5, 0);
    const shaft = new THREE.Mesh(shaftGeo, boneMat);
    legGroup.add(shaft);

    // Bone knuckle
    const knuckleGeo = new THREE.SphereGeometry(0.1, 12, 12);
    knuckleGeo.translate(0, 0.72, 0);
    const knuckle = new THREE.Mesh(knuckleGeo, boneMat);
    legGroup.add(knuckle);

    chickenGroup.add(legGroup);
  });

  // Fresh garnish: Lemon wedges & herbs
  const lemonGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.1, 16, 1, false, 0, Math.PI);
  lemonGeo.rotateZ(Math.PI / 2);
  const lemon1 = new THREE.Mesh(lemonGeo, lemonMat);
  lemon1.position.set(-1.1, -0.05, 0.4);
  lemon1.rotation.y = 0.5;
  chickenGroup.add(lemon1);

  const lemon2 = new THREE.Mesh(lemonGeo, lemonMat);
  lemon2.position.set(1.1, -0.05, 0.4);
  lemon2.rotation.y = -0.5;
  chickenGroup.add(lemon2);

  // Sprinkled herb flakes
  for (let i = 0; i < 18; i++) {
    const herbGeo = new THREE.BoxGeometry(0.06, 0.02, 0.06);
    const herb = new THREE.Mesh(herbGeo, herbMat);
    const theta = Math.random() * Math.PI * 2;
    const r = Math.random() * 0.65;
    herb.position.set(Math.cos(theta) * r, 0.4 + Math.random() * 0.15, Math.sin(theta) * r * 0.8);
    herb.rotation.set(Math.random(), Math.random(), Math.random());
    chickenGroup.add(herb);
  }

  sceneGroup.add(chickenGroup);

  // 3. STEAM PARTICLES SYSTEM (♨️ Rising 3D hot steam)
  const steamCount = 35;
  const steamGeo = new THREE.BufferGeometry();
  const steamPositions = new Float32Array(steamCount * 3);
  const steamVelocities: { x: number; y: number; z: number; resetY: number }[] = [];

  for (let i = 0; i < steamCount; i++) {
    const x = (Math.random() - 0.5) * 1.2;
    const y = 0.3 + Math.random() * 1.8;
    const z = (Math.random() - 0.5) * 0.9;
    steamPositions[i * 3] = x;
    steamPositions[i * 3 + 1] = y;
    steamPositions[i * 3 + 2] = z;

    steamVelocities.push({
      x: (Math.random() - 0.5) * 0.005,
      y: 0.012 + Math.random() * 0.015,
      z: (Math.random() - 0.5) * 0.005,
      resetY: 0.3
    });
  }

  steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));

  const steamMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.18,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
  });

  const steamParticles = new THREE.Points(steamGeo, steamMat);
  sceneGroup.add(steamParticles);

  const updateSteam = () => {
    const pos = steamParticles.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < steamCount; i++) {
      const idx = i * 3;
      pos[idx] += steamVelocities[i].x;
      pos[idx + 1] += steamVelocities[i].y;
      pos[idx + 2] += steamVelocities[i].z;

      if (pos[idx + 1] > 2.5) {
        pos[idx] = (Math.random() - 0.5) * 1.0;
        pos[idx + 1] = steamVelocities[i].resetY;
        pos[idx + 2] = (Math.random() - 0.5) * 0.8;
      }
    }
    steamParticles.geometry.attributes.position.needsUpdate = true;
  };

  return {
    sceneGroup,
    chickenGroup,
    plateGroup,
    steamParticles,
    updateSteam
  };
}

