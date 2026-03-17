import { useGLTF } from "@react-three/drei";

export default function PsuModal({
  position = [0,-1.2,0],
  rotation = [0, 0, 0],
  scale = 3
}) {
  const { scene } = useGLTF("/models/psu.glb");

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