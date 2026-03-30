import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

export default function GpuModel({brand ,motherboard ,isCompatible = true}) {

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
  const gpuMeshes = useRef([]);

  const { scene } = useGLTF(modelPath);

   const config = gpuConfigs[motherboard] || gpuConfigs.asus;

  useEffect(() => {
  gpuMeshes.current = [];

  scene.traverse((child) => {
    if (child.isMesh && child.material) {

      child.castShadow = true;
      child.receiveShadow = true;

      child.userData.isChildComponent = true;

      // ✅ store mesh
      gpuMeshes.current.push(child);

      // clone material
      child.material = child.material.clone();
      child.material.emissive = new THREE.Color("black");
      child.material.emissiveIntensity = 0;
    }
  });
}, [scene]);
useFrame(({ clock }) => {
  const t = clock.getElapsedTime();

  gpuMeshes.current.forEach((child) => {

    // 🔴 NOT compatible → pulse
    if (!isCompatible) {
      const pulse = 0.6 + Math.sin(t * 3) * 0.4;

      child.material.emissive = new THREE.Color("#ff0000");
      child.material.emissiveIntensity = pulse;
      child.material.toneMapped = false;
      return;
    }

    // ✅ normal
    child.material.emissive = new THREE.Color("black");
    child.material.emissiveIntensity = 0;
    child.material.toneMapped = true;
  });
});
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