"use client";
import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count }: { count: number }) {
  const meshRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      const isLime = Math.random() > 0.75;
      colors[i * 3] = isLime ? 0.851 : 0.4;
      colors[i * 3 + 1] = isLime ? 1.0 : 0.4;
      colors[i * 3 + 2] = isLime ? 0.0 : 0.4;
    }
    return [positions, colors];
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.025;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.015) * 0.08;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} vertexColors transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function FloatingOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.08;
  });

  return (
    <mesh ref={meshRef} position={[2.5, 0, -3]}>
      <icosahedronGeometry args={[1.1, 1]} />
      <meshStandardMaterial
        color="#D9FF00"
        wireframe
        transparent
        opacity={0.1}
        emissive="#D9FF00"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

export default function ParticleField() {
  const [particleCount, setParticleCount] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setReady(false);
      return;
    }
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4;
    setParticleCount(isMobile || isLowEnd ? 600 : 1400);
    setReady(true);
  }, []);

  if (!ready || particleCount === 0) {
    return (
      <div className="absolute inset-0 z-0 grid-bg opacity-40" aria-hidden="true" />
    );
  }

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
        frameloop="always"
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} color="#D9FF00" intensity={1.5} />
        <Particles count={particleCount} />
        <FloatingOrb />
        <fog attach="fog" args={["#050505", 12, 28]} />
      </Canvas>
    </div>
  );
}
