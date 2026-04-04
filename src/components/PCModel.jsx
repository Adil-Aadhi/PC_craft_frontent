import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const lerp = (a, b, t) => a + (b - a) * t;

function Exposure() {
  const { gl } = useThree();
  useEffect(() => {
    gl.toneMappingExposure = 1.4;
  }, []);
  return null;
}

/* ================= MODEL ================= */
function Model({ scrollProgress }) {
  const { scene: caseScene } = useGLTF("/models/new_pc_main.glb");
  const { scene: coolerScene } = useGLTF("/models/new_pc_cooler.glb");
  const { scene: fanScene } = useGLTF("/models/new_pc_fan.glb");

  const groupRef = useRef();
  const coolerFans = useRef([]);
  const caseFans = useRef([]);
  const coolerRGB = useRef([]);
  const caseRGB = useRef([]);

  function centerModel(model) {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.set(-center.x, -center.y, -center.z);
  }

  useEffect(() => {
    centerModel(caseScene);
    centerModel(coolerScene);
    centerModel(fanScene);

    coolerScene.position.set(10, 2, 0);
    fanScene.position.set(0, 0, -2);

    coolerScene.traverse((child) => {
      if (
        child.isMesh &&
        (child.name === "Object_4002" ||
          child.name === "Object_33001" ||
          child.name === "Object_38002")
      ) {
        coolerFans.current.push(child);
        coolerRGB.current.push(child);
      }
      if (child.material) {
        child.material = child.material.clone();
        child.material.emissive = new THREE.Color("black");
      }
    });

    fanScene.traverse((child) => {
      if (child.isMesh && child.name === "Object_2") {
        const worldPos = new THREE.Vector3();
        child.getWorldPosition(worldPos);
        const pivot = new THREE.Group();
        pivot.position.copy(fanScene.worldToLocal(worldPos));
        child.position.set(0, 0, 0);
        pivot.add(child);
        fanScene.add(pivot);
        caseFans.current.push(pivot);
        caseRGB.current.push(child);
      }
      if (child.material) {
        child.material = child.material.clone();
        child.material.emissive = new THREE.Color("black");
      }
    });
  }, [caseScene, coolerScene, fanScene]);

  const keyframes = [
    { progress: 0.0,  rotY: 0.4,  posX: 28,  posY: -14, posZ: 4 },
    { progress: 0.25, rotY: 0.1,  posX: -10, posY: -14, posZ: 6 },
    { progress: 0.5,  rotY: -0.5, posX: 31,  posY: -19, posZ: 5 },
    { progress: 0.75, rotY: 1.5,  posX: 10,  posY: -18, posZ: 2 },
    { progress: 1.0,  rotY: 0.4,  posX: 26,  posY: -20, posZ: 0 },
  ];

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const sp = scrollProgress.current;
    let prev = keyframes[0];
    let next = keyframes[keyframes.length - 1];

    for (let i = 0; i < keyframes.length - 1; i++) {
      if (sp >= keyframes[i].progress && sp <= keyframes[i + 1].progress) {
        prev = keyframes[i];
        next = keyframes[i + 1];
        break;
      }
    }

    // ✅ Fix 1 — clamp t, prevent NaN at exact keyframe boundaries
    const rawT = next.progress === prev.progress
      ? 0
      : (sp - prev.progress) / (next.progress - prev.progress);
    const t = Math.max(0, Math.min(1, rawT));

    const target = {
      rotY: lerp(prev.rotY, next.rotY, t),
      posX: lerp(prev.posX, next.posX, t),
      posY: lerp(prev.posY, next.posY, t),
      posZ: lerp(prev.posZ, next.posZ, t),
    };

    // ✅ Fix 2 — lower stiffness 4 → 2.5 for smooth slow scroll
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, target.rotY, 2.5, delta);
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, target.posX, 2.5, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, target.posY, 2.5, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, target.posZ, 2.5, delta);

    coolerFans.current.forEach((pivot) => { pivot.rotation.y += 0.025; });
    caseFans.current.forEach((pivot) => { pivot.rotation.z += 0.08; });

    const time = state.clock.getElapsedTime();
    const hue = (time * 0.2) % 1;
    const rgbColor = new THREE.Color().setHSL(hue, 1, 0.5);

    coolerRGB.current.forEach((mesh) => {
      mesh.material.emissive = rgbColor;
      mesh.material.emissiveIntensity = 80;
      mesh.material.toneMapped = false;
      mesh.material.needsUpdate = true;
    });

    caseRGB.current.forEach((mesh) => {
      mesh.material.emissive = rgbColor;
      mesh.material.emissiveIntensity = 80;
      mesh.material.toneMapped = false;
      mesh.material.needsUpdate = true;
    });

    coolerScene.traverse((child) => {
      if (child.isMesh && child.material) {
        if (coolerRGB.current.includes(child)) return;
        const c = child.material.color;
        const matName = child.material.name.toLowerCase();
        const isRGBPart =
          c.r > 0.7 && c.g > 0.7 && c.b > 0.7 &&
          !matName.includes("metal") &&
          !matName.includes("plastic") &&
          !matName.includes("logo") &&
          !matName.includes("pipe") &&
          !matName.includes("crsr");
        if (isRGBPart) {
          child.material.emissive = rgbColor;
          child.material.emissiveIntensity = 5;
          child.material.toneMapped = false;
        } else {
          child.material.emissiveIntensity = 0;
          child.material.toneMapped = true;
        }
      }
    });
  });

  return (
    <group ref={groupRef} scale={0.12}>
      <primitive object={caseScene} dispose={null} />
      <primitive object={coolerScene} dispose={null} />
      <primitive object={fanScene} dispose={null} />
    </group>
  );
}

/* ================= CAMERA ================= */
function CameraRig({ scrollProgress }) {
  const { camera } = useThree();

  const camKeyframes = [
    { progress: 0.0,  x: 0,   y: -2,  z: 48 },
    { progress: 0.25, x: 0,   y: 6,   z: 48 },
    { progress: 0.5,  x: 3,   y: -9,  z: 8  },
    { progress: 0.75, x: -20, y: 20,  z: 16 },
    { progress: 1.0,  x: 0,   y: -10, z: 50 },
  ];

  const modelKeyframes = [
    { progress: 0.0,  x: 10,  y: -8,   z: 2 },
    { progress: 0.25, x: -10, y: -7.5, z: 3 },
    { progress: 0.5,  x: 10,  y: -7.5, z: 3 },
    { progress: 0.75, x: 10,  y: -7.5, z: 3 },
    { progress: 1.0,  x: 10,  y: -14,  z: 0 },
  ];

  useFrame((state, delta) => {
    const sp = scrollProgress.current;
    let prev = camKeyframes[0];
    let next = camKeyframes[camKeyframes.length - 1];
    let mPrev = modelKeyframes[0];
    let mNext = modelKeyframes[modelKeyframes.length - 1];

    for (let i = 0; i < camKeyframes.length - 1; i++) {
      if (sp >= camKeyframes[i].progress && sp <= camKeyframes[i + 1].progress) {
        prev = camKeyframes[i];
        next = camKeyframes[i + 1];
        mPrev = modelKeyframes[i];
        mNext = modelKeyframes[i + 1];
        break;
      }
    }

    // ✅ Fix — clamp t, prevent NaN at exact keyframe boundaries
    const rawT = next.progress === prev.progress
      ? 0
      : (sp - prev.progress) / (next.progress - prev.progress);
    const t = Math.max(0, Math.min(1, rawT));

    camera.position.x = THREE.MathUtils.damp(camera.position.x, lerp(prev.x, next.x, t), 2.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, lerp(prev.y, next.y, t), 2.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, lerp(prev.z, next.z, t), 2.5, delta);
    camera.lookAt(lerp(mPrev.x, mNext.x, t), lerp(mPrev.y, mNext.y, t), lerp(mPrev.z, mNext.z, t));
  });

  return null;
}

/* ================= NEON TEXT OVERLAY ================= */
function NeonOverlay({ scrollProgress }) {
  const [phase, setPhase] = useState(0);
  const rafRef = useRef();

  useEffect(() => {
    const tick = () => {
      const sp = scrollProgress.current ?? 0;
      setPhase(sp >= 0.88 ? 1 : 0);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [scrollProgress]);

  return (
    <>
      {/* ── HELPER TEXT (scroll hint) — above canvas ── */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          pointerEvents: "none",
          opacity: phase === 0 ? 1 : 0,
          transition: "opacity 0.6s ease",
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontSize: "13px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(180,255,240,0.7)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Scroll to explore
        </span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <style>{`
            @keyframes bounceDown {
              0%, 100% { transform: translateY(0); opacity: 0.5; }
              50% { transform: translateY(5px); opacity: 1; }
            }
            .chevron { animation: bounceDown 1.4s ease infinite; }
          `}</style>
          <path
            className="chevron"
            d="M4 7l6 6 6-6"
            stroke="rgba(34,211,238,0.8)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* ── PC CRAFT NEON BRAND — BEHIND 3D (zIndex: 0, canvas is zIndex: 1) ── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "32%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none",
          opacity: phase === 1 ? 1 : 0,
          transition: "opacity 0.8s ease",
          zIndex: 0,
        }}
      >
        <span
          style={{
            fontSize: "11px",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(34,211,238,0.5)",
            fontFamily: "'Inter', sans-serif",
            marginBottom: "10px",
          }}
        >
          Engineered for dominance
        </span>

        <NeonTitle />

        <span
          style={{
            marginTop: "14px",
            fontSize: "13px",
            letterSpacing: "0.12em",
            color: "rgba(180,255,240,0.45)",
            fontFamily: "'Inter', sans-serif",
            textTransform: "uppercase",
          }}
        >
          Custom builds · RGB ready · Overclocked
        </span>
      </div>
    </>
  );
}

/* ── PC CRAFT SVG neon sign ── */
function NeonTitle() {
  return (
    <svg
      viewBox="0 0 520 90"
      width="460"
      style={{ overflow: "visible", maxWidth: "90vw" }}
    >
      <defs>
        <filter id="neon-glow" x="-30%" y="-80%" width="160%" height="360%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@900&display=swap');
          @keyframes neonFlicker {
            0%, 95%, 100% { opacity: 1; }
            96% { opacity: 0.85; }
            97% { opacity: 1; }
            98% { opacity: 0.7; }
            99% { opacity: 1; }
          }
          .neon-main {
            font-family: 'Orbitron', 'Courier New', monospace;
            font-size: 72px;
            font-weight: 900;
            letter-spacing: 0.08em;
            fill: #e0ffff;
            filter: url(#neon-glow);
            animation: neonFlicker 5s infinite;
          }
          .neon-pc { fill: #22d3ee; }
          .neon-craft { fill: #a78bfa; }
        `}</style>
      </defs>
      <text x="50%" y="75" textAnchor="middle" className="neon-main">
        <tspan className="neon-pc">PC</tspan>
        <tspan className="neon-craft"> CRAFT</tspan>
      </text>
    </svg>
  );
}



/* ================= MAIN EXPORT ================= */
export default function PCModel({ scrollProgress }) {
  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      {/* 3D Canvas */}
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        camera={{ position: [0, 6, 50], fov: 38 }}
        style={{ height: "100%", width: "100%", position: "relative", zIndex: 1 }}
      >
        <EffectComposer>
          <Bloom
            intensity={0.1}
            luminanceThreshold={0.95}
            luminanceSmoothing={0.6}
            mipmapBlur
          />
        </EffectComposer>

        <ambientLight intensity={0.25} />
        <directionalLight position={[8, 14, 12]} intensity={3.5} color="#ffffff" castShadow />
        <pointLight position={[-14, 4, 6]} intensity={2.8} color="#22d3ee" distance={60} decay={2} />
        <pointLight position={[12, -10, 4]} intensity={1.8} color="#34d399" distance={50} decay={2} />
        <pointLight position={[0, 6, -20]} intensity={1.2} color="#818cf8" distance={60} decay={2} />
        <spotLight position={[0, 20, 20]} angle={0.35} penumbra={0.8} intensity={2} color="#ffe4b5" castShadow={false} />

        <Environment preset="city" />
        <Exposure />

        <Suspense fallback={null}>
          <Model scrollProgress={scrollProgress} />
          <CameraRig scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>

      {/* DOM overlay — neon brand + helper + CTA */}
      <NeonOverlay scrollProgress={scrollProgress} />
    </div>
  );
}