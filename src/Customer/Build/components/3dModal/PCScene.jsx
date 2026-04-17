import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, useProgress } from "@react-three/drei";
import Model from "./Modal";
import Motherboard from "./MotherboardModel";
import { useState, useMemo, useEffect, Suspense } from "react";
import CaseFanModel from "./CaseFan";
import CpuCoolerModel from "./COOLERModal";
import PsuModal from "./PSUModal";
import { useCompatibility } from "../../hooks/useCompatibility";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { LoadingScreen } from "./pc builder loading";

function Table() {
  const texture = useTexture(
    "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/hardwood2_diffuse.jpg"
  );
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1.5);

  return (
    <group>
      <mesh position={[0, -1.2, 0]} receiveShadow>
        <boxGeometry args={[6, 0.08, 4]} />
        <meshStandardMaterial
          map={texture}
          color="#4a2e12"
          roughness={0.75}
          metalness={0.0}
          envMapIntensity={0.15}
        />
      </mesh>
      {[
        [-2.7, -1.7, -1.7],
        [2.7, -1.7, -1.7],
        [-2.7, -1.7, 1.7],
        [2.7, -1.7, 1.7],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} receiveShadow>
          <boxGeometry args={[0.12, 1.0, 0.12]} />
          <meshStandardMaterial color="#3a2208" roughness={0.8} metalness={0.0} />
        </mesh>
      ))}
    </group>
  );
}

function LoadingTracker({ onProgress, onLoaded }) {
  const { progress, active } = useProgress();

  useEffect(() => {
    onProgress(progress);
  }, [progress]);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => onLoaded(), 500);
      return () => clearTimeout(t);
    }
  }, [active]);

  return null;
}

function CanvasLoader() {
  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[0.001, 0.001]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

export default function PCScene({ build, sceneHeight = "900px" }) {
  const [showGlass, setShowGlass] = useState(false);
  const [rgbEnabled, setRgbEnabled] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { checkCompatibility } = useCompatibility();

  const categories = [
    "cpu",
    "motherboard",
    "ram",
    "storage",
    "gpu",
    "psu",
    "case",
    "casefan",
    "cooler",
  ];

  const compatibilityMap = useMemo(() => {
    const map = {};
    categories.forEach((category) => {
      const item = build[category];
      map[category] = item
        ? checkCompatibility(category, item)
        : { compatibility: "good" };
    });
    return map;
  }, [build, checkCompatibility]);

  useEffect(() => {
    setIsLoading(true);
    setLoadProgress(0);
  }, [build]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timeout);
  }, [build]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: sceneHeight,
        background:
          "radial-gradient(ellipse at 30% 60%, #2a0a4a 0%, #151530 45%, #0b0b18 100%)",
        overflow: "hidden",
      }}
    >
      {isLoading && <LoadingScreen progress={loadProgress} />}

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 70% 40%, rgba(120,40,255,0.25) 0%, transparent 55%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 15% 85%, rgba(0,180,255,0.16) 0%, transparent 50%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "28%",
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(140,60,255,0.35) 30%, rgba(0,180,255,0.25) 70%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "200px",
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(42,10,74,0.35) 0%, rgba(11,11,24,0.0) 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {build.case && !isLoading && (
        <div
          style={{
            position: "absolute",
            bottom: "110px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 5,
            display: "flex",
            gap: "10px",
            background: "rgba(255,255,255,0.06)",
            padding: "10px",
            borderRadius: "16px",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <button
            onClick={() => setShowGlass(!showGlass)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              background: showGlass ? "rgba(14,165,233,0.25)" : "rgba(255,255,255,0.08)",
              color: showGlass ? "#7dd3fc" : "rgba(255,255,255,0.65)",
              border: `1px solid ${
                showGlass ? "rgba(125,211,252,0.4)" : "rgba(255,255,255,0.12)"
              }`,
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "13px",
              letterSpacing: "0.02em",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = showGlass
                ? "rgba(14,165,233,0.35)"
                : "rgba(255,255,255,0.14)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = showGlass
                ? "rgba(14,165,233,0.25)"
                : "rgba(255,255,255,0.08)")
            }
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <path d="M3 9h18M3 15h18M9 3v18M15 3v18" strokeOpacity="0.5" />
            </svg>
            {showGlass ? "Glass On" : "Glass Off"}
          </button>

          <button
            onClick={() => setRgbEnabled(!rgbEnabled)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              background: rgbEnabled ? "rgba(168,85,247,0.22)" : "rgba(255,255,255,0.08)",
              color: rgbEnabled ? "#d8b4fe" : "rgba(255,255,255,0.65)",
              border: `1px solid ${
                rgbEnabled ? "rgba(216,180,254,0.35)" : "rgba(255,255,255,0.12)"
              }`,
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "13px",
              letterSpacing: "0.02em",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = rgbEnabled
                ? "rgba(168,85,247,0.32)"
                : "rgba(255,255,255,0.14)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = rgbEnabled
                ? "rgba(168,85,247,0.22)"
                : "rgba(255,255,255,0.08)")
            }
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
            {rgbEnabled ? "RGB On" : "RGB Off"}
          </button>
        </div>
      )}

      <Canvas
        shadows
        camera={{ position: [3.5, 2, 5], fov: 40 }}
        style={{ width: "100%", height: "100%", position: "relative", zIndex: 1 }}
        onCreated={({ camera, gl }) => {
          camera.layers.enable(0);
          camera.layers.enable(1);
          gl.setClearColor(0x000000, 0);
        }}
      >
        <LoadingTracker onProgress={setLoadProgress} onLoaded={() => setIsLoading(false)} />

        <ambientLight intensity={0.28} color="#c7d2ff" />
        <directionalLight position={[5, 5, 5]} intensity={1.3} castShadow shadow-mapSize={[2048, 2048]} />
        <directionalLight position={[-5, 3, 2]} intensity={0.5} color="#8ba5ff" />
        <directionalLight position={[0, 4, -5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[0, 6, 0]} intensity={0.6} />
        <pointLight position={[2, 1, 2]} intensity={0.4} color="#4466ff" />
        <pointLight position={[-2, 1.5, -2]} intensity={0.3} color="#ff8844" />
        <pointLight position={[-4, 2, -2]} intensity={0.5} color="#7828ff" />
        <pointLight position={[4, 1, 3]} intensity={0.3} color="#00b4ff" />

        <Table />

        <Suspense fallback={<CanvasLoader />}>
          <group position={[0, 0.11, 0]} rotation={[0, Math.PI / 4, 0]}>
            {build.case && (
              <>
                <Model showGlass={showGlass} caseName={build.case.name} />
                {build?.casefan && (
                  <CaseFanModel
                    rgb={rgbEnabled}
                    hasRGB={build?.casefan?.has_rgb}
                    isCompatible={compatibilityMap.casefan.compatibility !== "bad"}
                    caseName={build.case.name}
                  />
                )}
                {build?.cooler && (
                  <CpuCoolerModel
                    isCompatible={compatibilityMap.cooler.compatibility !== "bad"}
                    rgb={rgbEnabled}
                    brand={build.cooler.brand}
                  />
                )}
                {build?.psu && <PsuModal isCompatible={compatibilityMap.psu.compatibility !== "bad"} />}
              </>
            )}
            {build.motherboard && (
              <Motherboard
                build={build}
                isCompatible={compatibilityMap.motherboard.compatibility !== "bad"}
                ramCompatible={compatibilityMap.ram.compatibility !== "bad"}
                gpuCompatible={compatibilityMap.gpu.compatibility !== "bad"}
                cpuCompatible={compatibilityMap.motherboard.compatibility !== "bad"}
              />
            )}
          </group>
        </Suspense>

        <Environment preset="studio" intensity={0.15} />

        <directionalLight position={[0, 2, 5]} intensity={0.6} color="#ffffff" />

        <ContactShadows
          position={[0, -1.19, 0]}
          opacity={0.28}
          scale={10}
          blur={3.5}
          far={2}
          resolution={1024}
          color="#8b5cf6"
        />

        <EffectComposer>
          <Bloom intensity={0.45} luminanceThreshold={0.6} luminanceSmoothing={0.9} />
        </EffectComposer>

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={2.5}
          maxDistance={8}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={0.3}
        />
      </Canvas>
    </div>
  );
}
