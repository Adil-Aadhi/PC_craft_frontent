import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export default function GpuModel({brand ,motherboard }) {

  const gpuConfigs = {
  asus: {
    scale: 2,
    position: [61, -0.9, 6],
    rotation: [-Math.PI / 2, 0, -Math.PI / 2],
  },
  msi: {
    scale: 0.05,
    position: [0.05, 0.78, -0.1], // near PCIe slot
    rotation: [-4.53, Math.PI-0.23, 1.6], // base alignment
  },
};
  

   const gpuModels = {
    MSI: "/models/gpu msi.glb",
    ASUS: "/models/gpu rog.glb",
    NVIDIA: "/models/gpu nvidia.glb"
  };

  const modelPath = gpuModels[brand] || gpuModels["NVIDIA"];

  const { scene } = useGLTF(modelPath);

   const config = gpuConfigs[motherboard] || gpuConfigs.asus;

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      scale={config.scale}
      position={config.position}
      rotation={config.rotation}
    />
  );
}

useGLTF.preload("/models/gpu.glb");