"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { RotateCcw, Box, MoveHorizontal, Loader2 } from "lucide-react";

interface Shoe3DViewerProps {
  rotationImages: string[];
  name: string;
}

export default function Shoe3DViewer({ rotationImages, name }: Shoe3DViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Drag X motion value
  const x = useMotionValue(0);
  
  // Spring for momentum/inertia effect
  const springConfig = { damping: 20, stiffness: 100, mass: 1 };
  const springX = useSpring(x, springConfig);

  // Preload images
  useEffect(() => {
    if (!rotationImages || rotationImages.length === 0) return;
    
    let loaded = 0;
    const total = rotationImages.length;
    
    rotationImages.forEach((src) => {
      const img = new (window as any).Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded === total) {
          setIsLoaded(true);
        }
      };
    });
  }, [rotationImages]);

  // Map springX to image index
  // Each index corresponds to 40 pixels of drag
  const sensitivity = 40;
  
  useEffect(() => {
    return springX.onChange((latest) => {
      if (!rotationImages || rotationImages.length === 0) return;
      const total = rotationImages.length;
      // Calculate index based on drag position
      // Using modulo to wrap around for infinite rotation
      let index = Math.floor(Math.abs(latest / sensitivity)) % total;
      
      // If drag is positive, we want to reverse the direction to feel natural
      if (latest > 0) {
        index = (total - index) % total;
      }
      
      setCurrentIndex(index);
    });
  }, [rotationImages, springX]);

  if (!rotationImages || rotationImages.length === 0) {
    return (
      <div className="w-full aspect-square glass rounded-[3rem] flex flex-col items-center justify-center gap-4 text-white/10">
        <Box size={48} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em]">360° Set Missing</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square select-none" ref={containerRef}>
      {/* Loading State Overlay */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 glass rounded-[3rem] flex flex-col items-center justify-center gap-6"
          >
            <div className="relative w-20 h-20">
               <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
               <motion.div 
                 className="absolute inset-0 border-2 border-accent border-t-transparent rounded-full"
                 animate={{ rotate: 360 }}
                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
               />
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-black">{Math.round((loadedCount / rotationImages.length) * 100)}%</span>
               </div>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Initializing 360° Sphere</p>
              <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">Loading {rotationImages.length} High-Res Frames</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(0,242,255,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Main Interactive Viewer */}
      <motion.div 
        drag="x"
        _dragX={x} // Internal tracking
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        dragConstraints={{ left: -5000, right: 5000 }} // Large constraints for "infinite" feeling
        dragElastic={0}
        className="w-full h-full relative z-10 cursor-grab active:cursor-grabbing"
        onUpdate={(latest) => {
          // Manual update of the motion value since we don't want fixed boundaries
          x.set(latest.x as any);
        }}
      >
        <div className="w-full h-full relative pointer-events-none">
          {rotationImages.map((src, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-75 ease-out ${
                currentIndex === idx ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <Image
                src={src}
                alt={`${name} - Rotation ${idx}`}
                fill
                className="object-contain drop-shadow-[0_40px_100px_rgba(0,242,255,0.25)]"
                priority={idx === 0}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Control Overlay */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 pointer-events-none">
        <motion.div 
          animate={{ x: isDragging ? 0 : [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="glass-dark px-5 py-2.5 rounded-full flex items-center gap-3 border border-white/5 backdrop-blur-md"
        >
          <MoveHorizontal size={14} className="text-accent" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">
            {isDragging ? "Rotating Sphere" : "Swipe to Rotate"}
          </span>
        </motion.div>
        
        {/* Progress Bar (Circular wrap feel) */}
        <div className="w-32 h-[2px] bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-accent"
            animate={{ 
              width: `${((currentIndex + 1) / rotationImages.length) * 100}%` 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* Floating Badge */}
      <div className="absolute top-6 left-6 z-20">
        <div className="glass px-3 py-1.5 rounded-xl border border-accent/20 flex items-center gap-2">
          <div className="w-1 h-1 bg-accent rounded-full animate-ping" />
          <span className="text-[8px] font-black uppercase tracking-widest text-accent">True 360°</span>
        </div>
      </div>
    </div>
  );
}
