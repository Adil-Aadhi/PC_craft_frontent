import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

export default function RamModel({motherboard,isCompatible = true }) {

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

  const ramMeshes = useRef([]);
  
  useEffect(() => {
  ramMeshes.current = [];

  scene.traverse((child) => {
    if (child.isMesh && child.material) {

      child.castShadow = true;
      child.receiveShadow = true;

      // 🔥 mark as child component
      child.userData.isChildComponent = true;

      // ✅ store mesh
      ramMeshes.current.push(child);

      // clone material
      child.material = child.material.clone();
      child.material.emissive = new THREE.Color("black");
      child.material.emissiveIntensity = 0;
    }
  });
}, [scene]);

useFrame(({ clock }) => {
  const t = clock.getElapsedTime();

  ramMeshes.current.forEach((child) => {

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

useGLTF.preload("/models/ram.glb");