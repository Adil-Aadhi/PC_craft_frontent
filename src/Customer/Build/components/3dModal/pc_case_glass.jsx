import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export default function PcCaseGlassModel() {
  const { scene } = useGLTF("/models/pc_case_1_glass.glb");

  return (
    <primitive
      object={scene}
      scale={1}
      position={[0, 0, 0]}
      rotation={[0,0,0]}
    />
  );
}