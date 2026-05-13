"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  return (
    <section ref={containerRef} className="relative h-[110vh] w-full overflow-hidden flex flex-col items-center justify-center pt-20">
      {/* Cinematic Background Layers */}
      <div className="absolute inset-0 bg-grain z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_70%)] pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-transparent to-black z-0 pointer-events-none" />
      
      {/* Parallax Floating Sneaker */}
      <motion.div
        style={{ y: y1, scale, opacity }}
        initial={{ y: 100, opacity: 0, rotate: -25 }}
        animate={{ y: 0, opacity: 1, rotate: -15 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[450px] aspect-square"
      >
        <motion.div
          animate={{
            y: [-20, 20, -20],
            rotate: [-15, -12, -15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-full h-full filter drop-shadow-[0_40px_100px_rgba(255,255,255,0.15)]"
        >
          <Image
            src="/images/hero_sneaker.png"
            alt="Hero Sneaker"
            fill
            className="object-contain"
            priority
          />
        </motion.div>
      </motion.div>

      {/* Text Content with Parallax */}
      <motion.div 
        style={{ y: y2, opacity }}
        className="relative z-20 text-center mt-[-60px]"
      >
        <motion.div
          initial={{ opacity: 0, letterSpacing: "1em" }}
          animate={{ opacity: 1, letterSpacing: "0.4em" }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="text-accent font-heading font-black text-[10px] mb-4 uppercase"
        >
          MOVE DIFFERENT
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-6xl sm:text-8xl font-heading font-black tracking-tighter text-white leading-[0.8]"
        >
          ONE WAY <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 text-glow">
            SHOES
          </span>
        </motion.h1>
      </motion.div>

      {/* Luxury CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="flex gap-4 mt-16 z-30 px-6 w-full max-w-[400px]"
      >
        <button className="flex-1 bg-white text-black font-heading font-black py-5 rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
          SHOP NOW
        </button>
        <button className="flex-1 glass text-white font-heading font-black py-5 rounded-full hover:bg-white/10 active:scale-95 transition-all duration-300">
          EXPLORE
        </button>
      </motion.div>

      {/* Animated Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-12 flex flex-col items-center gap-3 opacity-30"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent" />
      </motion.div>
    </section>
  );
}

