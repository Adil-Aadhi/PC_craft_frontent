import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

export default function CpuModel({motherboard,cpu,isCompatible = true}) {

    const cpuModals={
    AMD:"/models/cpu ryzen.glb",
    Intel:"/models/cpu intel.glb"
  }

  const cpuConfigs = {
    asus: {
      scale: 1,
      position: [44, -28.7, 33.2],
      rotation: [Math.PI, Math.PI, 9.43],
    },
    msi: {
      scale: 0.015,
      position: [-0.25, 0.4, 0.265],
      rotation: [Math.PI+0.17, Math.PI, Math.PI-0.25]
    },
  };

  const modelpath=cpuModals[cpu] || cpuModals["AMD"]
  const cpuMeshes = useRef([]);

  const { scene } = useGLTF(modelpath);


  const config = cpuConfigs[motherboard] || cpuConfigs.asus;

  useEffect(() => {
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;

      // 🔥 IMPORTANT: mark as external component
      child.userData.isChildComponent = true;
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

useGLTF.preload("/models/cpu.glb");