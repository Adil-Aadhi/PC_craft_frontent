import { useGLTF } from "@react-three/drei";
import { useEffect,useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function CpuCoolerModel({
  position = [0, -1.2, 0.025],
  rotation = [0, 0, 0],
  scale = 3,
  isCompatible = true,
  rgb = true,
  brand
}) {

  const modelMap = {
  ASUS: "/models/cooler rog1.glb",
  MSI: "/models/cooler msi1.glb",
  CORSAIR: "/models/cooler.glb"
};

   const modelPath = modelMap[brand] || "/models/cooler.glb";

  const { scene } = useGLTF(modelPath);
  const fanRefs = useRef();



  // ✅ Clone materials once
  useEffect(() => {
  if (!scene) return;

  fanRefs.current = [];
  
  scene.traverse((child) => {

    if (child.isMesh) {

      // 🎯 EXACT MATCH (your fan blades)
      if (
        child.name === "Object_33" ||
        child.name === "Object_38" ||
        child.name === "Object_4"
      ) {
        fanRefs.current.push(child);
      }

      // your material clone logic
      child.material = child.material.clone();
      child.material.emissive = new THREE.Color("black");
      child.material.emissiveIntensity = 0;
    }

  });

  console.log("Fans found:", fanRefs.current);

}, [scene])

  // 🔥 Animation logic
  useFrame(({ clock }) => {
  if (!scene) return;

  fanRefs.current.forEach((fan) => {
    fan.rotation.y += 0.06; // adjust speed
  });

  const t = clock.getElapsedTime();

  scene.traverse((child) => {
    if (child.isMesh && child.material) {

      const c = child.material.color;
      const matName = child.material.name.toLowerCase();

      const worldPos = new THREE.Vector3();
      child.getWorldPosition(worldPos);

      // 🎯 ONLY BRIGHT (RGB) PARTS
      const isRGBPart =
          c.r > 0.7 && c.g > 0.7 && c.b > 0.7 &&
          !matName.includes("crsr") &&
          !matName.includes("logo") &&
          !matName.includes("svg") &&
          !matName.includes("metal") &&
          !matName.includes("plastic") &&
          !matName.includes("pipe")
      if (!isRGBPart) {
        child.material.emissiveIntensity = 0;
        child.material.toneMapped = true;
        return;
      }

      // 🔴 Incompatible
      if (!isCompatible) {
        const pulse = 0.6 + Math.sin(t * 3) * 0.4;

        child.material.emissive = new THREE.Color("#ff0000");
        child.material.emissiveIntensity = pulse;
        child.material.toneMapped = false;
        return;
      }

      // 🌈 RGB
      if (rgb) {
        const hue = (t * 0.1) % 1;
        const color = new THREE.Color().setHSL(hue, 1, 0.5);

        child.material.emissive = color;
        child.material.emissiveIntensity = 5;
        child.material.toneMapped = false;
        return;
      }

      // normal
      child.material.emissiveIntensity = 0;
      child.material.toneMapped = true;
    }
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

useGLTF.preload("/models/cooler.glb"); 