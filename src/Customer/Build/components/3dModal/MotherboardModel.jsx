import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import RamModel from "./RamModal";
import SSDModel from "./SSDModel";
import GpuModel from "./GPUModal";
import CpuModel from "./CpuModal";

export default function Motherboard({build}) {
  const brand = build?.motherboard?.brand?.toLowerCase() || "asus";

   const motherboardConfigs = {
    msi: {
      path: "/models/msi-motherboard.glb",
      scale: 2.5,
      position: [0.36, -2.14, 0.24],
      rotation: [-0.16, -0.03, 0.22],
    },
    asus: {
      path: "/models/motherboard.glb",
      scale: 0.057,
      position: [-3.4, -0.3, -0.79],
      rotation: [0, 0, 0],
    },
  };

  const config = motherboardConfigs[brand] || motherboardConfigs.asus;

  const { scene } = useGLTF(config.path);
  

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
  <primitive
    object={scene}
    scale={config.scale}
    position={config.position}
    rotation={config.rotation}
  >
    {/* <RamModel/> */}
    {build?.cpu && <CpuModel motherboard={brand} cpu={build.cpu.brand}/>}
    {build?.ram && <RamModel motherboard={brand}/>}
    {build?.storage && <SSDModel motherboard={brand} brand={build.storage.brand}/>}
    {build?.gpu && <GpuModel brand={build.gpu.brand} motherboard={brand}/>}
  </primitive>
);
}
useGLTF.preload("/models/motherboard.glb");
useGLTF.preload("/models/msi-motherboard.glb");