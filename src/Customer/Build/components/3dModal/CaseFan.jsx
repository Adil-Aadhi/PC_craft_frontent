import { useGLTF } from "@react-three/drei";
import { useEffect,useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function CaseFanModel({ rgb,hasRGB, isCompatible = true ,caseName}) {
  
  const modelpath = hasRGB
    ? "/models/case_fan_rgb2.glb"
    : "/models/case_fan.glb";

  const changeposition = caseName=="ASUS TUF GT301"?[0.97, -1.5, 2.63]:[0.97, -1.3, 2.63]

  const { scene } = useGLTF(modelpath);
  const fanRef = useRef();

  // base setup
 useEffect(() => {
  if (!scene) return;

  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material = child.material.clone();
    }

    // 🎯 detect BOTH models
    if (
      child.name === "Object_2" || 
      child.name === "Object_2001"
    ) {
      fanRef.current = child;
    }
  });
}, [scene]);

  // 🔥 Animation (RGB or Warning)
 useFrame(({ clock }) => {
  if (!scene) return;
  if (!fanRef.current) return;

  let speed = 0.12;

  // 🔁 Fix direction difference
  if (hasRGB) {
    fanRef.current.rotation.y += speed; // 🔥 reverse
  } else {
    fanRef.current.rotation.z += speed;
  }


  const t = clock.getElapsedTime();

  scene.traverse((child) => {
    if (child.isMesh && child.material) {

      // 🔴 Incompatible
      if (!isCompatible) {
        const pulse = 0.6 + Math.sin(t * 3) * 0.4;

        // 🔥 slightly darken original color (NOT override)
        child.material.color.multiplyScalar(0.6);

        // 🔴 strong red glow
        child.material.emissive.set("#ff0000");
        child.material.emissiveIntensity = pulse * 5;

        child.material.toneMapped = false;

        return;
      }

      // 🌈 RGB
      if (rgb && hasRGB) {
        const hue = (t * 0.1) % 1;
        const color = new THREE.Color().setHSL(hue, 1, 0.5);

        child.material.emissive = color;
        child.material.emissiveIntensity = 6;
        child.material.toneMapped = false;
        return;
      }

      // normal
      child.material.emissive = new THREE.Color("black"); // ✅ reset color
      child.material.emissiveIntensity = 0;
      child.material.toneMapped = true;
    }
  });
});
  return (
    <primitive
      object={scene}
      // position={[0.97, -1.3, 2.63]}
      position={changeposition}
      scale={3}
    />
  );
}