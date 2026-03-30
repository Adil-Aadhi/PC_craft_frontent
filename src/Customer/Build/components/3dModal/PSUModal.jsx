import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function PsuModal({
  position = [0,-1.2,0],
  rotation = [0, 0, 0],
  scale = 3,
  isCompatible = true 
}) {
  const { scene } = useGLTF("/models/psu.glb");
  const psuMeshes = useRef([]);

  useEffect(() => {
  psuMeshes.current = [];

  scene.traverse((child) => {
    if (child.isMesh && child.material) {

      // mark as child component (important for motherboard filtering)
      child.userData.isChildComponent = true;

      psuMeshes.current.push(child);

      child.material = child.material.clone();
      child.material.emissive = new THREE.Color("black");
      child.material.emissiveIntensity = 0;
    }
  });
}, [scene]);

useFrame(({ clock }) => {
  const t = clock.getElapsedTime();

  psuMeshes.current.forEach((child) => {

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
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

useGLTF.preload("/models/psu.glb");