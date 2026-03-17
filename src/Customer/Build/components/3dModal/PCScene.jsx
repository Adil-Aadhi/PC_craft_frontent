import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import Model from "./Modal";
import Motherboard from "./MotherboardModel";
import { useState } from "react";
import CaseFanModel from "./CaseFan";
import CpuCoolerModel from "./COOLERModal";
import PsuModal from "./PSUModal";

export default function PCScene({ build }) {

  const [showGlass, setShowGlass] = useState(true);

  console.log('build',build)

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "900px"
      }}
    >

      {/* Toggle Button */}
      {build.case && (
        <button
        onClick={() => setShowGlass(!showGlass)}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 999,
          padding: "10px 20px",
          background: "#0ea5e9",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        {showGlass ? "Remove Glass" : "Show Glass"}
      </button>
      )}
      

      <Canvas
        shadows
        camera={{ position: [5, 2.5, 5], fov: 45 }}
        style={{ width: "100%", height: "100%" }}
      >

        {/* Lighting */}
        <ambientLight intensity={3} />

        <directionalLight
          position={[5, 8, 5]}
          intensity={4}
          castShadow
        />

        <directionalLight
          position={[-5, 5, -5]}
          intensity={2}
        />

        <pointLight
          position={[0, 5, 0]}
          intensity={2}
        />

        {/* PC Components */}
       <group rotation={[0, Math.PI / 4, 0]}>

            {build.case && (
              <>
                <Model showGlass={showGlass} />

                {/* ✅ Case-based components */}
                {build?.casefan && <CaseFanModel rgb={build?.casefan?.has_rgb} />}
                {build?.cooler && <CpuCoolerModel  />}
                {build?.psu && <PsuModal />}
              </>
            )}

            {build.motherboard && (
              <Motherboard build={build} />
            )}

          </group>

        {/* HDR Environment */}
        <Environment preset="studio" />

        {/* Ground Shadow */}
        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
        />

        {/* Camera Control */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={10}
        />

      </Canvas>
    </div>
  );
}