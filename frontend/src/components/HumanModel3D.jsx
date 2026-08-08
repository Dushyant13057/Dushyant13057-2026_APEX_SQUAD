import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { create3DGarment, disposeGarmentGroup } from './Clothing3DBuilder';

const SKINS = { light: '#f5d6b8', medium: '#d4a574', tan: '#a0764e', dark: '#6b4c3b' };

export default function HumanModel3D({
  measurements = {}, gender = 'male', bodyType = 'regular', skinTone = 'medium',
  clothColor = '#1a1a2e', showCloth = false, autoRotate = false, outfitType = null,
  fitType = 'regular', height = 500, style = {}, rotationLocked = false, onCameraRef = null, pose = 'default',
  pattern = 'Solid', embroideryType = 'None', embroideryPlacement = 'chest'
}) {
  const ref = useRef();
  const mdl = useRef(), anim = useRef();
  const garmentRef = useRef(null);
  const ms = useRef({ down: false, px: 0, py: 0, ry: 0, rx: 0 });

  // Dynamically scale specific bones based on the measurements provided
  const applyMeasurements = useCallback((modelObj) => {
    if (!modelObj || (modelObj.type === 'Group' && modelObj.children.length === 0)) return;

    // Helper to safely scale a bone by its name
    const scaleBone = (name, x, y, z) => {
      const bone = modelObj.getObjectByName(name);
      if (bone) bone.scale.set(x, y, z);
    };

    // Parse measurements with defaults
    const mHeight = parseFloat(measurements.height) || 170;
    const mChest = parseFloat(measurements.chest) || 40;
    const mWaist = parseFloat(measurements.waist) || 32;
    const mHip = parseFloat(measurements.hip) || 38;
    const mShoulder = parseFloat(measurements.shoulder) || 45;
    const mArm = parseFloat(measurements.armLength) || 25;
    const mThigh = parseFloat(measurements.thigh) || 20;
    const mNeck = parseFloat(measurements.neck) || 15;

    // Calculate scaling factors relative to base standard proportions
    const heightScale = mHeight / 170;
    const chestScale = mChest / 40;
    const waistScale = mWaist / 32;
    const hipScale = mHip / 38;
    const shoulderScale = mShoulder / 45;
    const armScale = mArm / 25;
    const thighScale = mThigh / 20;
    const neckScale = mNeck / 15;

    // Global scale handles Height
    modelObj.scale.set(0.9 * heightScale, 0.9 * heightScale, 0.9 * heightScale);

    // Apply specific bone scales
    // Hips (thickness and width)
    scaleBone('mixamorig:Hips', hipScale, 1, hipScale);
    
    // Spine (waist)
    scaleBone('mixamorig:Spine', waistScale, 1, waistScale);
    scaleBone('mixamorig:Spine1', waistScale, 1, waistScale);
    
    // Chest
    scaleBone('mixamorig:Spine2', chestScale, 1, chestScale);
    
    // Neck
    scaleBone('mixamorig:Neck', neckScale, 1, neckScale);

    // Shoulders
    scaleBone('mixamorig:LeftShoulder', 1, shoulderScale, 1);
    scaleBone('mixamorig:RightShoulder', 1, shoulderScale, 1);

    // Arms
    scaleBone('mixamorig:LeftArm', armScale, 1, armScale);
    scaleBone('mixamorig:RightArm', armScale, 1, armScale);
    scaleBone('mixamorig:LeftForeArm', 1, armScale, 1);
    scaleBone('mixamorig:RightForeArm', 1, armScale, 1);

    // Legs
    scaleBone('mixamorig:LeftUpLeg', thighScale, 1, thighScale);
    scaleBone('mixamorig:RightUpLeg', thighScale, 1, thighScale);

  }, [measurements]);

  // Handle Skin Tone dynamically
  useEffect(() => {
    if (mdl.current && mdl.current.userData?.isLoaded) {
      const skinColor = new THREE.Color(SKINS[skinTone] || SKINS.medium);
      const skinMat = new THREE.MeshPhysicalMaterial({
        color: skinColor, roughness: 0.5, metalness: 0.01,
        clearcoat: 0.08, sheen: 0.15, sheenColor: new THREE.Color(0xddb8a0)
      });
      mdl.current.traverse((child) => {
        if (child.isMesh && child.material && (child.name.includes("Surface") || child.name.includes("Body"))) {
          child.material = skinMat;
        }
      });
    }
  }, [skinTone]);

  // Garment rendering update function
  const updateGarment = useCallback((targetModel = mdl.current) => {
    if (!targetModel || !targetModel.userData?.isLoaded) return;

    if (garmentRef.current) {
      disposeGarmentGroup(garmentRef.current);
      garmentRef.current = null;
    }

    const activeOutfit = outfitType || (showCloth ? 'T-Shirt' : null);

    if (activeOutfit) {
      const garment = create3DGarment(activeOutfit, {
        color: clothColor,
        pattern,
        embroidery: embroideryType,
        measurements,
        fitType,
      });

      targetModel.add(garment);
      garmentRef.current = garment;
    }
  }, [outfitType, clothColor, pattern, embroideryType, fitType, measurements, showCloth]);

  // Main Scene Initialization (Run Once)
  useEffect(() => {
    if (!ref.current) return;
    const w = ref.current.clientWidth, h = ref.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#2a2a2e');

    const camera = new THREE.PerspectiveCamera(28, w / h, 0.01, 100);
    camera.position.set(0, 1.0, 3.2);
    camera.lookAt(0, 0.85, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    ref.current.appendChild(renderer.domElement);

    /* Lighting */
    scene.add(new THREE.AmbientLight(0xd0c8c0, 0.6));
    const key = new THREE.DirectionalLight(0xfff5e6, 1.2);
    key.position.set(3, 5, 4); key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024); scene.add(key);
    scene.add(new THREE.DirectionalLight(0xb0c4de, 0.55).translateX(-3).translateY(3).translateZ(-2));
    scene.add(new THREE.DirectionalLight(0xffd4a0, 0.3).translateY(2).translateZ(-4));
    scene.add(new THREE.PointLight(0xfff8f0, 0.2, 10).translateY(4));
    scene.add(new THREE.HemisphereLight(0xb0c4de, 0x444422, 0.4));

    /* Floor */
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(3, 64),
      new THREE.MeshStandardMaterial({ color: 0x333338, roughness: 0.92 })
    );
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
    scene.add(floor);

    /* Load Realistic 3D Mannequin */
    const loader = new GLTFLoader();
    const loadingGroup = new THREE.Group();
    mdl.current = loadingGroup; 
    scene.add(loadingGroup);

    loader.load(
      '/human.glb',
      (gltf) => {
        const model = gltf.scene;
        model.userData.isLoaded = true;
        
        // Center the model on the floor initially
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.y = -box.min.y; // stand on floor
        model.position.x = -center.x;
        model.position.z = -center.z;
        
        model.traverse((child) => {
          if (child.isBone) {
            child.userData.defaultRotation = child.rotation.clone();
          }
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.remove(loadingGroup);
        scene.add(model);
        mdl.current = model;

        // Trigger initial apply of skin, measurements, and garments
        applyMeasurements(model);
        
        const skinColor = new THREE.Color(SKINS[skinTone] || SKINS.medium);
        const skinMat = new THREE.MeshPhysicalMaterial({
          color: skinColor, roughness: 0.5, metalness: 0.01,
          clearcoat: 0.08, sheen: 0.15, sheenColor: new THREE.Color(0xddb8a0)
        });
        model.traverse((child) => {
          if (child.isMesh && child.material && (child.name.includes("Surface") || child.name.includes("Body"))) {
            child.material = skinMat; 
          }
        });

        // IMMEDIATELY ATTACH 3D GARMENT ON LOAD
        updateGarment(model);
      },
      undefined,
      (error) => {
        console.error("Error loading realistic model:", error);
      }
    );

    /* Controls */
    const el = renderer.domElement;
    el.style.cursor = 'grab';
    const coords = e => ({ x: e.clientX ?? e.touches?.[0]?.clientX ?? 0, y: e.clientY ?? e.touches?.[0]?.clientY ?? 0 });
    const onDown = e => { ms.current.down = true; const c = coords(e); ms.current.px = c.x; ms.current.py = c.y; el.style.cursor = 'grabbing'; };
    const onUp = () => { ms.current.down = false; el.style.cursor = 'grab'; };
    const onMove = e => {
      if (!ms.current.down) return;
      const c = coords(e);
      ms.current.ry += (c.x - ms.current.px) * 0.008;
      ms.current.rx = Math.max(-0.5, Math.min(0.5, ms.current.rx + (c.y - ms.current.py) * 0.005));
      ms.current.px = c.x; ms.current.py = c.y;
    };
    const onWheel = e => { e.preventDefault(); camera.position.z = Math.max(1.5, Math.min(6, camera.position.z + e.deltaY * 0.003)); };

    el.addEventListener('mousedown', onDown);
    el.addEventListener('mouseup', onUp);
    el.addEventListener('mouseleave', onUp);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('touchstart', onDown, { passive: true });
    el.addEventListener('touchend', onUp);
    el.addEventListener('touchmove', onMove, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: false });

    const onResize = () => {
      if (!ref.current) return;
      camera.aspect = ref.current.clientWidth / ref.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(ref.current.clientWidth, ref.current.clientHeight);
    };
    window.addEventListener('resize', onResize);

    /* Render loop */
    const loop = () => {
      anim.current = requestAnimationFrame(loop);
      if (mdl.current) {
        mdl.current.rotation.y = ms.current.ry;
        mdl.current.rotation.x = ms.current.rx;
      }
      renderer.render(scene, camera);
    };
    loop();

    if (onCameraRef) {
      onCameraRef({
        setView: v => {
          ms.current.rx = 0;
          ms.current.ry = v === 'front' ? 0 : v === 'back' ? Math.PI : v === 'left' ? Math.PI / 2 : -Math.PI / 2;
        }
      });
    }

    return () => {
      cancelAnimationFrame(anim.current);
      if (garmentRef.current) {
        disposeGarmentGroup(garmentRef.current);
        garmentRef.current = null;
      }
      el.removeEventListener('mousedown', onDown);
      el.removeEventListener('mouseup', onUp);
      el.removeEventListener('mouseleave', onUp);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('touchstart', onDown);
      el.removeEventListener('touchend', onUp);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (ref.current?.contains(renderer.domElement)) ref.current.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Update 3D garment dynamically whenever outfit, color, pattern, embroidery, or measurements change
  useEffect(() => {
    if (mdl.current && mdl.current.userData?.isLoaded) {
      updateGarment(mdl.current);
    }
  }, [updateGarment]);

  // Watch for measurement changes after model is loaded
  useEffect(() => {
    if (mdl.current && mdl.current.userData?.isLoaded) {
      applyMeasurements(mdl.current);
    }
  }, [measurements, applyMeasurements]);

  // Handle Pose dynamically
  useEffect(() => {
    if (mdl.current && mdl.current.userData?.isLoaded) {
      const modelObj = mdl.current;

      // Restore default pose
      modelObj.traverse((child) => {
        if (child.isBone && child.userData.defaultRotation) {
          child.rotation.copy(child.userData.defaultRotation);
        }
      });

      // Apply new pose rotations
      const rotateBone = (name, x, y, z) => {
        const bone = modelObj.getObjectByName(name);
        if (bone) {
          bone.rotation.x += x;
          bone.rotation.y += y;
          bone.rotation.z += z;
        }
      };

      if (pose === 'hips') {
        rotateBone('mixamorig:LeftArm', 0, 0, 0.4);
        rotateBone('mixamorig:RightArm', 0, 0, -0.4);
        rotateBone('mixamorig:LeftForeArm', 0, 1.2, 0);
        rotateBone('mixamorig:RightForeArm', 0, -1.2, 0);
        rotateBone('mixamorig:Spine', 0, 0.1, 0.05);
      } else if (pose === 'crossed') {
        rotateBone('mixamorig:LeftArm', 0.6, 0, 0.3);
        rotateBone('mixamorig:RightArm', 0.6, 0, -0.3);
        rotateBone('mixamorig:LeftForeArm', 0, 1.6, 0);
        rotateBone('mixamorig:RightForeArm', 0, -1.6, 0);
        rotateBone('mixamorig:LeftHand', 0, 0.2, -0.2);
        rotateBone('mixamorig:RightHand', 0, -0.2, 0.2);
      } else if (pose === 'casual') {
        rotateBone('mixamorig:LeftArm', 0.1, 0, 0.1);
        rotateBone('mixamorig:RightArm', -0.1, 0, -0.2);
        rotateBone('mixamorig:RightForeArm', 0, -1.0, 0);
        rotateBone('mixamorig:Hips', 0, 0.2, 0);
        rotateBone('mixamorig:LeftUpLeg', 0.1, 0, 0.1);
        rotateBone('mixamorig:RightUpLeg', 0, -0.2, 0);
      }
    }
  }, [pose]);

  useEffect(() => {
    if (!autoRotate) return;
    const iv = setInterval(() => { ms.current.ry += 0.006; }, 16);
    return () => clearInterval(iv);
  }, [autoRotate]);

  return (
    <div ref={ref} style={{
      width: '100%', height: `${height}px`, borderRadius: '16px', overflow: 'hidden',
      background: 'linear-gradient(180deg, #3a3a40 0%, #2a2a2e 40%, #222226 100%)',
      cursor: 'grab', position: 'relative',
      border: '1px solid rgba(255,255,255,0.06)', ...style
    }} />
  );
}
