"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Globe, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  
  const yBg = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-32 bg-black">
      {/* Cinematic Lighting Layers */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_40%,rgba(0,242,255,0.05)_0%,transparent_60%)]" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent/5 blur-[150px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full animate-pulse-slow delay-1000" />
      </div>
      
      <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none z-10" />

      {/* Epic Background Typography */}
      <motion.div 
        style={{ y: yBg, opacity }}
        className="absolute top-[25%] left-1/2 -translate-x-1/2 w-full text-center z-0 select-none pointer-events-none overflow-hidden"
      >
        <h1 className="text-[25vw] font-heading font-black text-white/[0.015] tracking-tighter leading-none whitespace-nowrap">
          ULTRA LUXURY
        </h1>
      </motion.div>

      {/* Main Content Area - Typography Focused */}
      <div className="relative z-30 flex flex-col items-center text-center space-y-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <div className="flex items-center justify-center gap-4">
             <motion.div initial={{ width: 0 }} animate={{ width: 40 }} className="h-[1px] bg-accent" />
             <p className="text-[10px] md:text-xs font-black text-white/40 uppercase tracking-[0.8em]">Est. 2026 / Global Drop</p>
             <motion.div initial={{ width: 0 }} animate={{ width: 40 }} className="h-[1px] bg-accent" />
          </div>

          <h1 className="text-6xl md:text-9xl font-heading font-black tracking-tighter leading-[0.85] uppercase">
            Define <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-white to-purple-500">Your Pace</span>
          </h1>
          
          <div className="flex flex-wrap justify-center gap-6 pt-4 opacity-40">
             {[
               { icon: <Globe size={14} />, text: "Global Shipping" },
               { icon: <ShieldCheck size={14} />, text: "Verified Quality" },
               { icon: <Zap size={14} />, text: "Instant Drops" }
             ].map((item, i) => (
               <div key={i} className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-[8px] font-black uppercase tracking-widest">{item.text}</span>
               </div>
             ))}
          </div>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-white/40 text-sm md:text-lg leading-relaxed max-w-xl mx-auto font-medium px-4"
        >
          A new era of footwear has arrived. We combine architectural precision with high-performance materials to create the ultimate motion experience.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full"
        >
          <Link href="/shop" className="group w-full md:w-auto bg-white text-black px-12 py-6 rounded-2xl font-heading font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all glow-soft hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            EXPLORE CATALOG <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="w-full md:w-auto glass px-10 py-6 rounded-2xl flex items-center justify-center gap-3 text-white/60 hover:text-white active:scale-90 transition-all border border-white/5">
            <Play size={16} fill="currentColor" className="text-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest">BRAND FILM</span>
          </button>
        </motion.div>
      </div>

      {/* Category Quick Links (Replacement for Images) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-24 flex gap-12 md:gap-24 opacity-30 hover:opacity-60 transition-opacity"
      >
        {["Sneakers", "Sandals", "Slippers"].map((cat) => (
          <button key={cat} className="group flex flex-col items-center gap-2">
             <span className="text-[9px] font-black uppercase tracking-[0.3em] group-hover:text-accent transition-colors">{cat}</span>
             <div className="w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-500" />
          </button>
        ))}
      </motion.div>

      {/* Animated Scroll Prompt */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 flex flex-col items-center gap-4 opacity-20 z-30"
      >
        <span className="text-[8px] font-black uppercase tracking-[0.5em] vertical-text">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white via-white/50 to-transparent" />
      </motion.div>
    </section>
  );
}
