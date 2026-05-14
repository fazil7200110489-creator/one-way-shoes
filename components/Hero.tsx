"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const rotate = useTransform(scrollY, [0, 500], [-10, 5]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-20">
      {/* Cinematic Lighting Layers */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(0,242,255,0.08)_0%,transparent_50%)]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-gradient-to-t from-background via-background to-transparent z-10" />
      <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none z-20" />

      {/* Background Text */}
      <motion.div 
        style={{ y: y1, opacity }}
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full text-center z-0 select-none pointer-events-none"
      >
        <h1 className="text-[20vw] font-heading font-black text-white/[0.02] tracking-tighter leading-none whitespace-nowrap">
          ONE WAY
        </h1>
      </motion.div>

      {/* Main Content Area */}
      <div className="relative z-20 flex flex-col items-center gap-12">
        <motion.div
          style={{ y: y2, rotate }}
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[600px] aspect-square group"
        >
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-accent/10 rounded-full blur-[120px] animate-pulse-soft" />
          
          <motion.div className="relative w-full h-full animate-float">
            <Image
              src="/images/hero_sneaker.png"
              alt="Luxury Sneaker"
              fill
              priority
              className="object-contain filter drop-shadow-[0_40px_100px_rgba(0,242,255,0.15)] group-hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
        </motion.div>

        {/* Hero Copy */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center space-y-8 max-w-xl"
        >
          <div className="space-y-2">
            <p className="text-label tracking-[0.6em]">Spring Summer 2026</p>
            <h1 className="text-shadow-cinematic">BEYOND<br /><span className="text-accent">VELOCITY</span></h1>
          </div>
          
          <p className="text-white/40 text-xs md:text-sm leading-relaxed max-w-sm mx-auto font-medium">
            Engineered for the elite. Experience the next evolution of performance footwear through cinematic design.
          </p>

          <div className="flex items-center justify-center gap-6 pt-4">
            <Link href="/product/1" className="bg-white text-black px-10 py-5 rounded-full font-heading font-black text-xs uppercase tracking-widest flex items-center gap-3 active:scale-95 transition-all glow-soft">
              EXPLORE COLLECTION <ArrowRight size={18} />
            </Link>
            <button className="glass w-14 h-14 rounded-full flex items-center justify-center text-white active:scale-90 transition-all">
              <Play size={20} fill="currentColor" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Animated Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-12 flex flex-col items-center gap-3 opacity-30 z-30"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent" />
      </motion.div>
    </section>
  );
}
