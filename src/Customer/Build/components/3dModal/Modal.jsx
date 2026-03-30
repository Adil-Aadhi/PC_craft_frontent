import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import PcCaseGlassModel from "./pc_case_glass";

export default function Model({showGlass ,caseName }) {

  const caseModelMap = {
    "NZXT H210 Mini ITX": "/models/pc_case_3.glb",
    "Cooler Master NR200 Mini ITX": "/models/pc_case_9.glb",
    "Cooler Master Q300L": "/models/pc_case_7.glb",
    "ASUS ROG Hyperion": "/models/pc_case_4_spcl.glb",
    "MSI MPG Gungnir 110R": "/models/pc_case_6.glb",
    "MSI MPG Velox 100R": "/models/pc_case_5_alt.glb",
    "ASUS TUF GT301": "/models/pc_case_8.glb",
    "NZXT H510 Mid Tower": "/models/pc_case_2.glb",
    "DEFAULT": "/models/pc_case_2.glb"
  };

  const modelPath = caseModelMap[caseName] || caseModelMap["DEFAULT"];
  const { scene } = useGLTF(modelPath);

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
      {showGlass && <PcCaseGlassModel caseName={caseName}/>}
    </primitive>
  );
}