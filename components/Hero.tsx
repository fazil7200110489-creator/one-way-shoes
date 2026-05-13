"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center pt-20">
      {/* Cinematic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_70%)] pointer-events-none" />
      
      {/* Floating Sneaker */}
      <motion.div
        initial={{ y: 50, opacity: 0, rotate: -15 }}
        animate={{ y: 0, opacity: 1, rotate: -5 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[400px] aspect-square"
      >
        <motion.div
          animate={{
            y: [-15, 15, -15],
            rotate: [-5, -2, -5],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-full h-full"
        >
          <Image
            src="/images/hero_sneaker.png"
            alt="Hero Sneaker"
            fill
            className="object-contain drop-shadow-[0_20px_50px_rgba(255,255,255,0.2)]"
            priority
          />
        </motion.div>
      </motion.div>

      {/* Text Content */}
      <div className="relative z-20 text-center mt-[-40px]">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-accent font-heading font-medium tracking-[0.3em] text-sm mb-2"
        >
          MOVE DIFFERENT
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-5xl font-heading font-black tracking-tighter text-white"
        >
          ONE WAY <br /> <span className="text-glow">SHOES</span>
        </motion.h1>
      </div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex gap-4 mt-12 z-20 px-6 w-full max-w-[400px]"
      >
        <button className="flex-1 bg-white text-black font-heading font-bold py-4 rounded-full hover:bg-accent transition-colors duration-300">
          SHOP NOW
        </button>
        <button className="flex-1 glass text-white font-heading font-bold py-4 rounded-full hover:bg-white/10 transition-colors duration-300">
          EXPLORE
        </button>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.2em] font-light">SCROLL</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </motion.div>
    </section>
  );
}
