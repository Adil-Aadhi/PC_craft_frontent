import { useGLTF } from "@react-three/drei";

export default function CaseFanModel({rgb}) {
  
   const modelpath = rgb
    ? "/models/case_fan_rgb2.glb"
    : "/models/case_fan.glb";

  const { scene } = useGLTF(modelpath);


  return (
    <primitive
      object={scene}
      position={[0.97,-1.3,2.63]}
      rotation={[0, 0, 0]}
      scale={3}
    />
  );
}