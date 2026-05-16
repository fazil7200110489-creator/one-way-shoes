"use client";

import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { 
  OrbitControls, 
  Stage, 
  PerspectiveCamera, 
  Float, 
  Environment, 
  ContactShadows,
  BakeShadows,
  useGLTF,
  Html
} from "@react-three/drei";
import { Loader2, Move, ZoomIn } from "lucide-react";
import * as THREE from "three";

interface ModelProps {
  url: string;
}

function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  // Smooth rotation on load or subtle idle animation
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={1} 
      position={[0, 0, 0]} 
    />
  );
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
          <div className="absolute inset-0 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent animate-pulse whitespace-nowrap">
          Loading 3D Geometry
        </p>
      </div>
    </Html>
  );
}

interface Product3DModelProps {
  modelUrl: string;
}

export default function Product3DModel({ modelUrl }: Product3DModelProps) {
  const [isInteracting, setIsInteracting] = useState(false);

  return (
    <div className="relative w-full aspect-square md:aspect-video select-none touch-none">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle,rgba(0,242,255,0.05)_0%,transparent_70%)] pointer-events-none" />
      
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        className="w-full h-full"
      >
        <Suspense fallback={<Loader />}>
          <Stage 
            intensity={0.5} 
            environment="city" 
            adjustCamera={1.2} 
            shadows={{ type: 'contact', opacity: 0.4, blur: 2 }}
          >
            <Float
              speed={1.5} 
              rotationIntensity={0.5} 
              floatIntensity={0.5}
            >
              <Model url={modelUrl} />
            </Float>
          </Stage>
          <BakeShadows />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls 
          makeDefault 
          enablePan={false} 
          enableZoom={true} 
          minDistance={2}
          maxDistance={8}
          autoRotate={!isInteracting}
          autoRotateSpeed={0.5}
          onStart={() => setIsInteracting(true)}
          onEnd={() => setIsInteracting(false)}
        />
      </Canvas>

      {/* Control Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 pointer-events-none">
        <div className="glass-dark px-5 py-2.5 rounded-full flex items-center gap-4 border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Move size={12} className="text-accent" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Rotate</span>
          </div>
          <div className="w-[1px] h-3 bg-white/10" />
          <div className="flex items-center gap-2">
            <ZoomIn size={12} className="text-accent" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Zoom</span>
          </div>
        </div>
      </div>

      {/* Luxury Badge */}
      <div className="absolute top-6 left-6 z-20">
        <div className="glass px-4 py-2 rounded-2xl border border-accent/20 flex items-center gap-3 backdrop-blur-xl">
          <div className="relative">
             <div className="w-2 h-2 bg-accent rounded-full" />
             <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-40" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent">Interactive Reality</span>
        </div>
      </div>
    </div>
  );
}
