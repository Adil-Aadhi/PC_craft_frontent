import { useGLTF } from "@react-three/drei";

export default function CpuCoolerModel({
  position = [0,-1.2,0.025],
  rotation = [0, 0, 0],
  scale = 3
}) {
  const { scene } = useGLTF("/models/cooler.glb");

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