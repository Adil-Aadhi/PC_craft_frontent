import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import PcCaseGlassModel from "./pc_case_glass";

export default function Model({showGlass }) {
  const { scene } = useGLTF("/models/pc_case_2.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.metalness = 0.4;
        child.material.roughness = 0.6;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      scale={3}
      position={[0, -1.2, 0]}
      rotation={[0,0,0]}
    >
      {showGlass && <PcCaseGlassModel />}
    </primitive>
  );
}