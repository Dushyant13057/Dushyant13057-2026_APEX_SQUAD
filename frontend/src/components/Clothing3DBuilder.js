import * as THREE from 'three';

// Cache for generated pattern textures to avoid re-creating on every render
const textureCache = new Map();

/**
 * Generates a dynamic canvas texture for fabric patterns.
 */
export function getPatternTexture(patternName, baseColorHex = '#1a1a2e') {
  const key = `${patternName}_${baseColorHex}`;
  if (textureCache.has(key)) {
    return textureCache.get(key);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const baseColor = new THREE.Color(baseColorHex);
  const darkColor = baseColor.clone().multiplyScalar(0.7).getStyle();
  const lightColor = baseColor.clone().offsetHSL(0, 0, 0.18).getStyle();
  const accentGold = '#d4a574';

  ctx.fillStyle = baseColor.getStyle();
  ctx.fillRect(0, 0, 256, 256);

  if (patternName === 'Stripes') {
    ctx.fillStyle = lightColor;
    for (let i = 0; i < 256; i += 32) {
      ctx.fillRect(i, 0, 16, 256);
    }
  } else if (patternName === 'Checks') {
    ctx.fillStyle = darkColor;
    for (let x = 0; x < 256; x += 32) {
      for (let y = 0; y < 256; y += 32) {
        if ((x / 32 + y / 32) % 2 === 0) {
          ctx.fillRect(x, y, 32, 32);
        }
      }
    }
  } else if (patternName === 'Polka Dots') {
    ctx.fillStyle = accentGold;
    for (let x = 16; x < 256; x += 32) {
      for (let y = 16; y < 256; y += 32) {
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (patternName === 'Herringbone') {
    ctx.strokeStyle = lightColor;
    ctx.lineWidth = 4;
    for (let y = -256; y < 512; y += 24) {
      ctx.beginPath();
      for (let x = 0; x < 256; x += 24) {
        ctx.moveTo(x, y + x);
        ctx.lineTo(x + 12, y + x - 12);
        ctx.lineTo(x + 24, y + x);
      }
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);

  textureCache.set(key, texture);
  return texture;
}

/**
 * Creates fabric material based on color, pattern, and fabric type.
 */
export function createGarmentMaterial(colorHex = '#1a1a2e', patternName = 'Solid', fabricType = 'Cotton') {
  const texture = patternName && patternName !== 'Solid' ? getPatternTexture(patternName, colorHex) : null;
  const fName = (typeof fabricType === 'object' ? fabricType.fabric : fabricType) || 'Cotton';

  let roughness = 0.65;
  let metalness = 0.05;
  let clearcoat = 0.0;
  let sheen = 0.1;

  if (fName.includes('Silk') || fName.includes('Satin')) {
    roughness = 0.25;
    metalness = 0.2;
    clearcoat = 0.4;
    sheen = 0.5;
  } else if (fName.includes('Denim')) {
    roughness = 0.85;
    metalness = 0.02;
  } else if (fName.includes('Velvet')) {
    roughness = 0.95;
    sheen = 0.8;
  } else if (fName.includes('Polyester')) {
    roughness = 0.45;
    metalness = 0.15;
  } else if (fName.includes('Wool')) {
    roughness = 0.9;
  }

  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(colorHex),
    map: texture,
    roughness,
    metalness,
    clearcoat,
    sheen,
    sheenColor: new THREE.Color(0xffffff),
    side: THREE.DoubleSide,
  });
}

/**
 * Creates decorative embroidery 3D overlays tailored for T-Pose mannequin chest & collar.
 */
export function createEmbroideryOverlay(embroideryType = 'None', placement = 'chest') {
  if (!embroideryType || embroideryType === 'None' || embroideryType === 'none') {
    return null;
  }

  const embGroup = new THREE.Group();
  embGroup.name = 'EmbroideryOverlay';

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xd4a574,
    metalness: 0.85,
    roughness: 0.25,
  });

  const redMat = new THREE.MeshStandardMaterial({
    color: 0xc41e3a,
    metalness: 0.4,
    roughness: 0.4,
  });

  const silverMat = new THREE.MeshStandardMaterial({
    color: 0xe0e0e0,
    metalness: 0.9,
    roughness: 0.2,
  });

  const type = typeof embroideryType === 'object' ? embroideryType.name : embroideryType;

  if (type === 'Minimal' || type.includes('Chain')) {
    // Minimal crest badge on chest
    const badgeGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.008, 16);
    const badgeMesh = new THREE.Mesh(badgeGeo, goldMat);
    badgeMesh.rotation.x = Math.PI / 2;
    badgeMesh.position.set(-0.09, 1.34, 0.15);
    embGroup.add(badgeMesh);
  } else if (type === 'Floral' || type.includes('Cross')) {
    // Floral emblem cluster
    const centerGeo = new THREE.SphereGeometry(0.018, 12, 12);
    const centerMesh = new THREE.Mesh(centerGeo, redMat);
    centerMesh.position.set(-0.08, 1.34, 0.15);
    embGroup.add(centerMesh);

    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const petalGeo = new THREE.TorusGeometry(0.014, 0.005, 8, 16);
      const petal = new THREE.Mesh(petalGeo, goldMat);
      petal.position.set(-0.08 + Math.cos(angle) * 0.032, 1.34 + Math.sin(angle) * 0.032, 0.15);
      embGroup.add(petal);
    }
  } else if (type === 'Traditional' || type.includes('Satin')) {
    // Ornate traditional neck collar band & chest placket border
    const bandGeo = new THREE.TorusGeometry(0.082, 0.010, 12, 32, Math.PI);
    const bandMesh = new THREE.Mesh(bandGeo, goldMat);
    bandMesh.rotation.x = Math.PI / 2;
    bandMesh.position.set(0, 1.46, 0.05);
    embGroup.add(bandMesh);

    // Placket vertical strip
    const placketGeo = new THREE.BoxGeometry(0.024, 0.18, 0.01);
    const placketMesh = new THREE.Mesh(placketGeo, redMat);
    placketMesh.position.set(0, 1.30, 0.152);
    embGroup.add(placketMesh);

    // Buttons
    for (let y = 1.24; y <= 1.36; y += 0.04) {
      const btnGeo = new THREE.SphereGeometry(0.007, 8, 8);
      const btnMesh = new THREE.Mesh(btnGeo, goldMat);
      btnMesh.position.set(0, y, 0.158);
      embGroup.add(btnMesh);
    }
  } else if (type === 'Royal' || type.includes('French')) {
    // Royal Zardozi medallion & shoulder trims
    const medallionGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.01, 24);
    const medallionMesh = new THREE.Mesh(medallionGeo, goldMat);
    medallionMesh.rotation.x = Math.PI / 2;
    medallionMesh.position.set(0, 1.32, 0.152);
    embGroup.add(medallionMesh);

    const innerGeo = new THREE.TorusGeometry(0.038, 0.006, 12, 24);
    const innerMesh = new THREE.Mesh(innerGeo, silverMat);
    innerMesh.position.set(0, 1.32, 0.158);
    embGroup.add(innerMesh);

    const starGeo = new THREE.SphereGeometry(0.015, 12, 12);
    const starMesh = new THREE.Mesh(starGeo, redMat);
    starMesh.position.set(0, 1.32, 0.160);
    embGroup.add(starMesh);

    // Shoulder trims
    [-0.22, 0.22].forEach(x => {
      const shoulderTrim = new THREE.BoxGeometry(0.06, 0.01, 0.10);
      const trimMesh = new THREE.Mesh(shoulderTrim, goldMat);
      trimMesh.position.set(x, 1.46, 0.02);
      embGroup.add(trimMesh);
    });
  }

  return embGroup;
}

/**
 * Builds clean 3D garments custom-fitted for the T-Pose mannequin model.
 */
export function create3DGarment(outfitType = 'T-Shirt', options = {}) {
  const {
    color = '#1a1a2e',
    pattern = 'Solid',
    fabric = 'Cotton',
    embroidery = 'None',
    measurements = {},
    fitType = 'regular',
  } = options;

  const garmentGroup = new THREE.Group();
  garmentGroup.name = `Garment_${outfitType}`;

  const mat = createGarmentMaterial(color, pattern, fabric);

  const trimColor = new THREE.Color(color).getHex() === 0xffffff ? 0xcccccc : 0x15151b;
  const trimMat = new THREE.MeshStandardMaterial({
    color: trimColor,
    roughness: 0.5,
    metalness: 0.1,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xd4a574,
    metalness: 0.8,
    roughness: 0.3,
  });

  // Fit scale multiplier — base is already loose-fit by default
  let fitMult = 1.20;  // base is loose so clothes drape outside the mannequin
  if (fitType === 'tight') fitMult = 1.08;
  else if (fitType === 'loose') fitMult = 1.30;
  else if (fitType === 'oversized') fitMult = 1.45;

  // Measurement ratios relative to standard body defaults
  const mChest = (parseFloat(measurements.chest) || 40) / 40;
  const mWaist = (parseFloat(measurements.waist) || 32) / 32;
  const mHip = (parseFloat(measurements.hip) || 38) / 38;
  const mShoulder = (parseFloat(measurements.shoulder) || 45) / 45;
  const mArm = (parseFloat(measurements.armLength) || 25) / 25;
  const mThigh = (parseFloat(measurements.thigh) || 20) / 20;

  const type = (outfitType || 'T-Shirt').toLowerCase();

  if (type.includes('jacket')) {
    // ==========================================
    // --- REALISTIC 3D JACKET (T-POSE LOOSE FIT) ---
    // ==========================================
    const chestRadX = 0.26 * mChest * mShoulder * fitMult; // Wide — sits clearly outside chest
    const waistRadX = 0.24 * mWaist * fitMult;             // Wide — drapes over waist
    const depthZ    = 0.20 * mChest * fitMult;             // Deep — front to back clearance
    const jacketH   = 0.54;
    const centerY   = 1.24;

    // Outer Jacket Back Shell
    const backGeo = new THREE.CylinderGeometry(chestRadX, waistRadX, jacketH, 32, 1, false, Math.PI * 0.65, Math.PI * 0.7);
    const backMesh = new THREE.Mesh(backGeo, mat);
    backMesh.position.set(0, centerY, 0);
    backMesh.castShadow = true;
    garmentGroup.add(backMesh);

    // Front Left Jacket Panel
    const frontLeftGeo = new THREE.CylinderGeometry(chestRadX, waistRadX, jacketH, 24, 1, false, Math.PI * 0.05, Math.PI * 0.42);
    const frontLeftMesh = new THREE.Mesh(frontLeftGeo, mat);
    frontLeftMesh.position.set(0, centerY, 0);
    frontLeftMesh.castShadow = true;
    garmentGroup.add(frontLeftMesh);

    // Front Right Jacket Panel
    const frontRightGeo = new THREE.CylinderGeometry(chestRadX, waistRadX, jacketH, 24, 1, false, Math.PI * 0.53, Math.PI * 0.42);
    const frontRightMesh = new THREE.Mesh(frontRightGeo, mat);
    frontRightMesh.position.set(0, centerY, 0);
    frontRightMesh.castShadow = true;
    garmentGroup.add(frontRightMesh);

    // Lapels (Collar Notch) on Left & Right
    const lapelGeo = new THREE.BoxGeometry(0.06, 0.20, 0.015);
    const leftLapel = new THREE.Mesh(lapelGeo, trimMat);
    leftLapel.position.set(-chestRadX * 0.5, 1.38, depthZ * 0.95);
    leftLapel.rotation.z = -0.25;
    leftLapel.rotation.y = 0.2;
    garmentGroup.add(leftLapel);

    const rightLapel = new THREE.Mesh(lapelGeo, trimMat);
    rightLapel.position.set(chestRadX * 0.5, 1.38, depthZ * 0.95);
    rightLapel.rotation.z = 0.25;
    rightLapel.rotation.y = -0.2;
    garmentGroup.add(rightLapel);

    // Buttons / Zipper down center
    for (let y = 1.05; y <= 1.32; y += 0.07) {
      const zipBtn = new THREE.SphereGeometry(0.008, 8, 8);
      const zipMesh = new THREE.Mesh(zipBtn, goldMat);
      zipMesh.position.set(-0.03, y, depthZ * 0.98);
      garmentGroup.add(zipMesh);
    }

    // Horizontal T-Pose Sleeves — thicker radius so arms don't poke out
    const sleeveRad = 0.095 * mChest * fitMult;
    const sleeveLen = 0.44 * mArm;
    const sleeveGeo = new THREE.CylinderGeometry(sleeveRad * 1.05, sleeveRad * 0.88, sleeveLen, 24);

    const leftSleeve = new THREE.Mesh(sleeveGeo, mat);
    leftSleeve.position.set(-chestRadX - (sleeveLen / 2), 1.46, 0);
    leftSleeve.rotation.z = Math.PI / 2;
    leftSleeve.castShadow = true;
    garmentGroup.add(leftSleeve);

    const rightSleeve = new THREE.Mesh(sleeveGeo, mat);
    rightSleeve.position.set(chestRadX + (sleeveLen / 2), 1.46, 0);
    rightSleeve.rotation.z = -Math.PI / 2;
    rightSleeve.castShadow = true;
    garmentGroup.add(rightSleeve);

    // Wrist Cuffs
    const cuffGeo = new THREE.CylinderGeometry(sleeveRad * 0.90, sleeveRad * 0.90, 0.045, 24);
    const leftCuff = new THREE.Mesh(cuffGeo, trimMat);
    leftCuff.position.set(-chestRadX - sleeveLen, 1.46, 0);
    leftCuff.rotation.z = Math.PI / 2;
    garmentGroup.add(leftCuff);

    const rightCuff = new THREE.Mesh(cuffGeo, trimMat);
    rightCuff.position.set(chestRadX + sleeveLen, 1.46, 0);
    rightCuff.rotation.z = -Math.PI / 2;
    garmentGroup.add(rightCuff);

  } else if (type.includes('hoodie')) {
    // ==========================================
    // --- HOODIE (T-POSE LOOSE FIT) ---
    // ==========================================
    const chestRad = 0.26 * mChest * mShoulder * fitMult;
    const waistRad = 0.24 * mWaist * fitMult;
    const torsoH   = 0.54;
    const centerY  = 1.23;

    const torsoGeo = new THREE.CylinderGeometry(chestRad, waistRad, torsoH, 32);
    const torsoMesh = new THREE.Mesh(torsoGeo, mat);
    torsoMesh.position.set(0, centerY, 0);
    torsoMesh.castShadow = true;
    garmentGroup.add(torsoMesh);

    // Kangaroo Front Pouch
    const pocketGeo = new THREE.BoxGeometry(0.26 * fitMult, 0.16, 0.04);
    const pocketMesh = new THREE.Mesh(pocketGeo, mat);
    pocketMesh.position.set(0, 1.06, waistRad + 0.01);
    garmentGroup.add(pocketMesh);

    // Hood behind neck
    const hoodGeo = new THREE.SphereGeometry(0.17, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.7);
    const hoodMesh = new THREE.Mesh(hoodGeo, mat);
    hoodMesh.position.set(0, 1.52, -0.06);
    hoodMesh.rotation.x = 0.35;
    garmentGroup.add(hoodMesh);

    // Hood Drawstrings
    [-0.04, 0.04].forEach(x => {
      const stringGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.22, 8);
      const stringMesh = new THREE.Mesh(stringGeo, trimMat);
      stringMesh.position.set(x, 1.34, chestRad + 0.02);
      garmentGroup.add(stringMesh);
    });

    // Horizontal T-Pose Sleeves — thick enough to cover arms
    const sleeveRad = 0.100 * mChest * fitMult;
    const sleeveLen = 0.44 * mArm;
    const sleeveGeo = new THREE.CylinderGeometry(sleeveRad, sleeveRad * 0.82, sleeveLen, 24);

    const leftSleeve = new THREE.Mesh(sleeveGeo, mat);
    leftSleeve.position.set(-chestRad - (sleeveLen / 2), 1.46, 0);
    leftSleeve.rotation.z = Math.PI / 2;
    garmentGroup.add(leftSleeve);

    const rightSleeve = new THREE.Mesh(sleeveGeo, mat);
    rightSleeve.position.set(chestRad + (sleeveLen / 2), 1.46, 0);
    rightSleeve.rotation.z = -Math.PI / 2;
    garmentGroup.add(rightSleeve);

  } else if (type.includes('shirt')) {
    // ==========================================
    // --- DRESS SHIRT (T-POSE LOOSE FIT) ---
    // ==========================================
    const isHalf = type.includes('half');
    const isSleeveless = type.includes('sleeveless');
    const chestRad = 0.24 * mChest * mShoulder * fitMult;
    const waistRad = 0.22 * mWaist * fitMult;
    const torsoH   = 0.52;
    const centerY  = 1.24;

    const torsoGeo = new THREE.CylinderGeometry(chestRad, waistRad, torsoH, 32);
    const torsoMesh = new THREE.Mesh(torsoGeo, mat);
    torsoMesh.position.set(0, centerY, 0);
    torsoMesh.castShadow = true;
    garmentGroup.add(torsoMesh);

    // Folded Shirt Collar
    const collarGeo = new THREE.TorusGeometry(chestRad * 0.48, 0.020, 12, 32);
    const collarMesh = new THREE.Mesh(collarGeo, trimMat);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.set(0, 1.49, 0);
    garmentGroup.add(collarMesh);

    // Center Button Placket Strip
    const placketGeo = new THREE.BoxGeometry(0.030, torsoH, 0.012);
    const placketMesh = new THREE.Mesh(placketGeo, trimMat);
    placketMesh.position.set(0, centerY, waistRad + 0.005);
    garmentGroup.add(placketMesh);

    // White Shirt Buttons
    for (let y = 1.02; y <= 1.42; y += 0.08) {
      const btnGeo = new THREE.SphereGeometry(0.006, 8, 8);
      const btnMesh = new THREE.Mesh(btnGeo, trimMat);
      btnMesh.position.set(0, y, waistRad + 0.012);
      garmentGroup.add(btnMesh);
    }

    // Horizontal T-Pose Sleeves
    if (!isSleeveless) {
      const sleeveLen = isHalf ? 0.22 : 0.44 * mArm;
      const sleeveRad = 0.095 * mChest * fitMult;
      const sleeveGeo = new THREE.CylinderGeometry(sleeveRad, sleeveRad * 0.86, sleeveLen, 24);

      const leftSleeve = new THREE.Mesh(sleeveGeo, mat);
      leftSleeve.position.set(-chestRad - (sleeveLen / 2), 1.46, 0);
      leftSleeve.rotation.z = Math.PI / 2;
      garmentGroup.add(leftSleeve);

      const rightSleeve = new THREE.Mesh(sleeveGeo, mat);
      rightSleeve.position.set(chestRad + (sleeveLen / 2), 1.46, 0);
      rightSleeve.rotation.z = -Math.PI / 2;
      garmentGroup.add(rightSleeve);
    }

  } else if (type.includes('kurta')) {
    // ==========================================
    // --- TRADITIONAL INDIAN KURTA (T-POSE LOOSE FIT) ---
    // ==========================================
    const chestRad = 0.25 * mChest * mShoulder * fitMult;
    const hipRad   = 0.26 * mHip * fitMult;
    const tunicH   = 0.80; // Knee-length tunic
    const centerY  = 1.10;

    const tunicGeo = new THREE.CylinderGeometry(chestRad, hipRad, tunicH, 32);
    const tunicMesh = new THREE.Mesh(tunicGeo, mat);
    tunicMesh.position.set(0, centerY, 0);
    tunicMesh.castShadow = true;
    garmentGroup.add(tunicMesh);

    // Mandarin (Nehru) Collar
    const collarGeo = new THREE.CylinderGeometry(chestRad * 0.50, chestRad * 0.50, 0.045, 32, 1, true);
    const collarMesh = new THREE.Mesh(collarGeo, trimMat);
    collarMesh.position.set(0, 1.49, 0);
    garmentGroup.add(collarMesh);

    // Traditional Placket Strip
    const placketGeo = new THREE.BoxGeometry(0.034, 0.28, 0.012);
    const placketMesh = new THREE.Mesh(placketGeo, trimMat);
    placketMesh.position.set(0, 1.34, chestRad + 0.005);
    garmentGroup.add(placketMesh);

    // Gold Buttons
    for (let y = 1.22; y <= 1.44; y += 0.05) {
      const btnGeo = new THREE.SphereGeometry(0.007, 8, 8);
      const btnMesh = new THREE.Mesh(btnGeo, goldMat);
      btnMesh.position.set(0, y, chestRad + 0.012);
      garmentGroup.add(btnMesh);
    }

    // Horizontal T-Pose Sleeves
    const sleeveRad = 0.095 * mChest * fitMult;
    const sleeveLen = 0.42 * mArm;
    const sleeveGeo = new THREE.CylinderGeometry(sleeveRad, sleeveRad * 0.82, sleeveLen, 24);

    const leftSleeve = new THREE.Mesh(sleeveGeo, mat);
    leftSleeve.position.set(-chestRad - (sleeveLen / 2), 1.46, 0);
    leftSleeve.rotation.z = Math.PI / 2;
    garmentGroup.add(leftSleeve);

    const rightSleeve = new THREE.Mesh(sleeveGeo, mat);
    rightSleeve.position.set(chestRad + (sleeveLen / 2), 1.46, 0);
    rightSleeve.rotation.z = -Math.PI / 2;
    garmentGroup.add(rightSleeve);

  } else if (type.includes('pant') || type.includes('bottom') || type.includes('trouser')) {
    // ==========================================
    // --- PANTS / TROUSERS (T-POSE LOOSE FIT) ---
    // ==========================================
    const waistRad = 0.22 * mWaist * fitMult;
    const thighRad = 0.130 * mThigh * fitMult;
    const ankleRad = 0.095 * fitMult;
    const legLen   = 0.88 * (measurements.legLength ? parseFloat(measurements.legLength) / 32 : 1);

    // Waistband Belt
    const waistGeo = new THREE.CylinderGeometry(waistRad, waistRad, 0.08, 32);
    const waistMesh = new THREE.Mesh(waistGeo, trimMat);
    waistMesh.position.set(0, 0.98, 0);
    garmentGroup.add(waistMesh);

    // Left Leg — wider so it wraps over leg mesh
    const legGeo = new THREE.CylinderGeometry(thighRad, ankleRad, legLen, 24);
    const leftLeg = new THREE.Mesh(legGeo, mat);
    leftLeg.position.set(-0.13 * mHip, 0.50, 0);
    leftLeg.castShadow = true;
    garmentGroup.add(leftLeg);

    // Right Leg
    const rightLeg = new THREE.Mesh(legGeo, mat);
    rightLeg.position.set(0.13 * mHip, 0.50, 0);
    rightLeg.castShadow = true;
    garmentGroup.add(rightLeg);

  } else {
    // ==========================================
    // --- T-SHIRT / SANDO (DEFAULT T-POSE LOOSE FIT) ---
    // ==========================================
    const isSando  = type === 'sando';
    const chestRad = 0.240 * mChest * mShoulder * fitMult;
    const waistRad = 0.220 * mWaist * fitMult;
    const torsoH   = 0.48;
    const centerY  = 1.26;

    const torsoGeo = new THREE.CylinderGeometry(chestRad, waistRad, torsoH, 32);
    const torsoMesh = new THREE.Mesh(torsoGeo, mat);
    torsoMesh.position.set(0, centerY, 0);
    torsoMesh.castShadow = true;
    garmentGroup.add(torsoMesh);

    // Collar ring — sized relative to wider chest
    const collarGeo = new THREE.TorusGeometry(chestRad * 0.46, 0.018, 12, 32);
    const collarMesh = new THREE.Mesh(collarGeo, trimMat);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.set(0, 1.48, 0);
    garmentGroup.add(collarMesh);

    // Horizontal Short Sleeves — thicker tube to cover arm mesh
    if (!isSando) {
      const sleeveRad = 0.100 * mChest * fitMult;
      const sleeveLen = 0.22;
      const sleeveGeo = new THREE.CylinderGeometry(sleeveRad, sleeveRad * 0.86, sleeveLen, 24);

      const leftSleeve = new THREE.Mesh(sleeveGeo, mat);
      leftSleeve.position.set(-chestRad - (sleeveLen / 2), 1.46, 0);
      leftSleeve.rotation.z = Math.PI / 2;
      garmentGroup.add(leftSleeve);

      const rightSleeve = new THREE.Mesh(sleeveGeo, mat);
      rightSleeve.position.set(chestRad + (sleeveLen / 2), 1.46, 0);
      rightSleeve.rotation.z = -Math.PI / 2;
      garmentGroup.add(rightSleeve);
    }
  }

  // Add decorative embroidery overlay if specified
  const embroideryMesh = createEmbroideryOverlay(embroidery);
  if (embroideryMesh) {
    garmentGroup.add(embroideryMesh);
  }

  return garmentGroup;
}

/**
 * Cleanly disposes of a Three.js object group and all its geometries, materials, and textures.
 */
export function disposeGarmentGroup(group) {
  if (!group) return;
  group.traverse(child => {
    if (child.isMesh) {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => {
            if (m.map) m.map.dispose();
            m.dispose();
          });
        } else {
          if (child.material.map) child.material.map.dispose();
          child.material.dispose();
        }
      }
    }
  });
  if (group.parent) {
    group.parent.remove(group);
  }
}
