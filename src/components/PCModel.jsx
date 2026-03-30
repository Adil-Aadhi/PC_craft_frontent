import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";

// Lerp helper
const lerp = (a, b, t) => a + (b - a) * t;

/* ================= MODEL ================= */
function Model({ scrollProgress }) {
  const { scene } = useGLTF("/models/main_pc.glb");
  const groupRef = useRef();

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.set(-center.x, -center.y, -center.z);
  }, [scene]);

  const keyframes = [
    { progress: 0.00, rotY: 0.4,  posX:  28, posY: -14, posZ: 6 },
    { progress: 0.25, rotY: 0.1,  posX: -10, posY: -14, posZ: 6 },
    { progress: 0.50, rotY: -0.5, posX:  31, posY: -19, posZ: 5 },
    { progress: 0.75, rotY: 1.5,  posX:  10, posY: -18, posZ: 1 },
    { progress: 1.00, rotY: 0.4,  posX:  20, posY: -20, posZ: 4 },
  ];

  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.position.set(10, -8, 0);
    groupRef.current.rotation.y = -0.4;
  }, []);

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

    const t = (sp - prev.progress) / (next.progress - prev.progress);

    const target = {
      rotY: lerp(prev.rotY, next.rotY, t),
      posX: lerp(prev.posX, next.posX, t),
      posY: lerp(prev.posY, next.posY, t),
      posZ: lerp(prev.posZ, next.posZ, t),
    };

    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, target.rotY, 4, delta);
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, target.posX, 4, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, target.posY, 4, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, target.posZ, 4, delta);
  });

  return <primitive ref={groupRef} object={scene} scale={0.12} />;
}

/* ================= CAMERA ================= */
function CameraRig({ scrollProgress }) {
  const { camera } = useThree();

  const camKeyframes = [
    { progress: 0.0,  x:  0, y:  -2, z: 48 },
    { progress: 0.25, x:  0, y:   6, z: 48 },
    { progress: 0.50, x:  3, y:  -9, z:  8 },
    { progress: 0.75, x: -20, y: 20, z: 16 },
    { progress: 1.0,  x:  0, y: -10, z: 50 },
  ];

  const modelKeyframes = [
    { progress: 0.0,  x:  10, y:  -8,   z: 2 },
    { progress: 0.25, x: -10, y:  -7.5, z: 3 },
    { progress: 0.50, x:  10, y:  -7.5, z: 3 },
    { progress: 0.75, x:  10, y:  -7.5, z: 3 },
    { progress: 1.0,  x:  10, y: -14,   z: 0 },
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

    const t = (sp - prev.progress) / (next.progress - prev.progress);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, lerp(prev.x, next.x, t), 3, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, lerp(prev.y, next.y, t), 3, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, lerp(prev.z, next.z, t), 3, delta);

    camera.lookAt(lerp(mPrev.x, mNext.x, t), lerp(mPrev.y, mNext.y, t), lerp(mPrev.z, mNext.z, t));
  });

  return null;
}

/* ================= MAIN EXPORT ================= */
export default function PCModel({ scrollProgress }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 6, 50], fov: 38 }}
      style={{ height: "100%", width: "100%" }}
    >
      {/* ── LIGHTING ── */}

      {/* Soft fill — keeps dark sides visible */}
      <ambientLight intensity={0.5} />

      {/* Key light — warm white from top-front-right */}
      <directionalLight
        position={[8, 14, 12]}
        intensity={3.5}
        color="#ffffff"
        castShadow
      />

      {/* Cyan rim — left side, matches neon glow on bg */}
      <pointLight
        position={[-14, 4, 6]}
        intensity={2.8}
        color="#22d3ee"
        distance={60}
        decay={2}
      />

      {/* Green accent — bottom-right, subtle underglow */}
      <pointLight
        position={[12, -10, 4]}
        intensity={1.8}
        color="#34d399"
        distance={50}
        decay={2}
      />

      {/* Cool back-fill — purple tint from behind */}
      <pointLight
        position={[0, 6, -20]}
        intensity={1.2}
        color="#818cf8"
        distance={60}
        decay={2}
      />

      {/* Warm front top — reduces harshness on glass/metal panels */}
      <spotLight
        position={[0, 20, 20]}
        angle={0.35}
        penumbra={0.8}
        intensity={2}
        color="#ffe4b5"
        castShadow={false}
      />

      <Environment preset="city" />

      <Suspense fallback={null}>
        <Model scrollProgress={scrollProgress} />
        <CameraRig scrollProgress={scrollProgress} />
      </Suspense>
    </Canvas>
  );
}