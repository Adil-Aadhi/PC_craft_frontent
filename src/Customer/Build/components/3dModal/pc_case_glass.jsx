import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export default function PcCaseGlassModel({caseName}) {

  const caseModelMap = {
    "NZXT H210 Mini ITX": "/models/pc_case_3_glass.glb",
    "Cooler Master NR200 Mini ITX": "/models/pc_case_1_glass.glb",
    "Cooler Master Q300L": "/models/pc_case_7_glass.glb",
    "ASUS ROG Hyperion": "/models/pc_case_4_glass.glb",
    "MSI MPG Gungnir 110R": "/models/pc_case_6_glass.glb",
    "MSI MPG Velox 100R": "/models/pc_case_5_glass.glb",
    "ASUS TUF GT301": "/models/pc_case_8_glass.glb",
    "NZXT H510 Mid Tower": "/models/pc_case_9_glass.glb",
    "DEFAULT": "/models/pc_case_1_glass.glb"
  };

  const modelPath = caseModelMap[caseName] || caseModelMap["DEFAULT"];
  const { scene } = useGLTF(modelPath);

  return (
    <primitive
      object={scene}
      scale={1}
      position={[0, 0, 0]}
      rotation={[0,0,0]}
    />
  );
}