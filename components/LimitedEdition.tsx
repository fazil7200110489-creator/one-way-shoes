"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function LimitedEdition() {
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 px-6">
      <div className="relative glass-dark rounded-[3rem] overflow-hidden p-8 flex flex-col items-center">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 text-center mb-8">
          <span className="bg-white text-black text-[10px] font-black px-4 py-1 rounded-full tracking-[0.2em] mb-4 inline-block">
            DROP ALERT
          </span>
          <h2 className="text-4xl font-heading font-black tracking-tighter mb-2">LIMITED EDITION</h2>
          <p className="text-white/40 text-sm">NEO-GENESIS X1 SERIES</p>
        </div>

        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="relative w-full aspect-[4/3] mb-8"
        >
          <Image
            src="/images/sneaker_all_black.png"
            alt="Limited Sneaker"
            fill
            className="object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          />
        </motion.div>

        <div className="flex gap-4 mb-10">
          {[
            { label: "HRS", val: timeLeft.h },
            { label: "MIN", val: timeLeft.m },
            { label: "SEC", val: timeLeft.s },
          ].map((t, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="glass w-16 h-16 flex items-center justify-center rounded-2xl mb-2">
                <span className="text-2xl font-heading font-bold">{t.val.toString().padStart(2, '0')}</span>
              </div>
              <span className="text-[10px] font-bold text-accent tracking-widest">{t.label}</span>
            </div>
          ))}
        </div>

        <button className="relative z-10 w-full bg-accent text-black font-heading font-bold py-5 rounded-3xl glow-accent">
          NOTIFY ME
        </button>
      </div>
    </section>
  );
}
