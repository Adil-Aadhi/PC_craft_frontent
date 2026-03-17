import { useGLTF, useTexture } from "@react-three/drei";

export default function SSDModel({motherboard,brand}) {

  const ssdModels = {
    Samsung: "/models/ssd samsung.glb",
    Corsair: "/models/ssd corsair.glb",
    WD: "/models/ssd wd.glb"
  };

  const modelPath=ssdModels[brand] || ssdModels["Samsung"]

  const ssdConfigs = {
    asus: {
      scale: 1,
      position: [64.7, -1.6, 7.12],
      rotation: [0, 0.15, 0.12],
    },
    msi: {
      scale: 0.02, 
      position: [0.15, 0.75, -0.12],
      rotation: [0.23, 0.2, -0.15],
    },
  };
  const { scene } = useGLTF(modelPath);

  const config = ssdConfigs[motherboard] || ssdConfigs.asus;

  return (
    <group
      position={config.position}
      rotation={config.rotation}
      scale={config.scale}
    >
      {/* SSD model */}
      <primitive object={scene} />
    </group>
  );
}