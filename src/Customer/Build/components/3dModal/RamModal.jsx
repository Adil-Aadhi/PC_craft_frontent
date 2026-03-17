import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export default function RamModel({motherboard }) {

  const ramConfigs = {
    asus: {
      scale: 1,
      position: [-22.6, 48.85, 30.4],
      rotation: [Math.PI, 0, 0],
    },
    msi: {
      scale: 0.02,
      position: [-1.71, 0.55, -0.275],
      rotation: [Math.PI+0.2,Math.PI, Math.PI-0.25],
    },
  };
  const { scene } = useGLTF("/models/ram.glb");

  const config = ramConfigs[motherboard] || ramConfigs.asus;

  return (
    <primitive
      object={scene}
      scale={config.scale}
      position={config.position}
      rotation={config.rotation}
    />
  );
}

useGLTF.preload("/models/ram.glb");