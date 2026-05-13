"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
          <div className="absolute inset-0 bg-grain pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]"
          />

          <div className="relative overflow-hidden py-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl font-heading font-black tracking-tighter text-white text-glow mb-1"
            >
              ONE WAY
            </motion.h1>
            
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"
            />
            
            <motion.h2
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm font-sans font-black tracking-[1em] text-white/40 text-center mt-3 ml-[1em]"
            >
              SHOES
            </motion.h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-20 flex flex-col items-center gap-4"
          >
            <span className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">
              Initializing Experience
            </span>
            <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

