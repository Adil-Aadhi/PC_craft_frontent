import { useGLTF, Environment, useScroll } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function Scene() {
  const { scene } = useGLTF("/models/main_pc.glb");
  const modelRef = useRef();
  const scroll = useScroll();
  const { camera } = useThree();

  useEffect(() => {
    if (!modelRef.current) return;

    // Center model
    const box = new THREE.Box3().setFromObject(modelRef.current);
    const center = box.getCenter(new THREE.Vector3());
    modelRef.current.position.sub(center);

    // Auto scale
    const size = box.getSize(new THREE.Vector3()).length();
    const scaleFactor = 2 / size;
    modelRef.current.scale.setScalar(scaleFactor * 1.5);
  }, []);

  useFrame(() => {
    const t = scroll.offset; // 0 → 1

    // 1. Camera zoom to model
    if (t < 0.5) {
      camera.position.z = 8 - t * 10; // zoom in
      camera.position.y = 1 - t * 0.5;
    }

    // 2. Lock camera + rotate model
    if (t >= 0.5) {
      camera.position.z = 3;
      camera.position.y = 0.5;

      modelRef.current.rotation.y = (t - 0.5) * Math.PI * 2;
    }
  });

  return (
    <>
      <Environment preset="city" />
      <primitive ref={modelRef} object={scene} />
    </>
  );
}