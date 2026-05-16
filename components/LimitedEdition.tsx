"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Package } from "lucide-react";

export default function LimitedEdition() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 0 });

  useEffect(() => {
    fetchLimitedProducts();
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

  const fetchLimitedProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (Array.isArray(data)) {
        // Filter limited products and sort by newest
        const limited = data
          .filter((p: any) => p.isLimitedEdition === true)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setProducts(limited);
      }
    } catch (err) {
      console.error("Failed to fetch limited products:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4 opacity-30">
        <Loader2 className="animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em]">Syncing Limited Vault</p>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-20 px-6 space-y-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-heading font-black tracking-tighter uppercase">Limited Drops</h2>
        <p className="text-label tracking-[0.4em]">Exclusive Reality Series</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {products.map((product, idx) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="relative glass-dark rounded-[3rem] overflow-hidden p-8 flex flex-col items-center"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10 text-center mb-8">
              <span className="bg-white text-black text-[10px] font-black px-4 py-1 rounded-full tracking-[0.2em] mb-4 inline-block">
                DROP ALERT
              </span>
              <h2 className="text-4xl font-heading font-black tracking-tighter mb-2 uppercase">{product.name}</h2>
              <p className="text-white/40 text-sm uppercase">{product.description?.substring(0, 40) || "Exclusive Edition"}</p>
            </div>

            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative w-full aspect-[4/3] mb-8"
            >
              <Image
                src={product.images?.[0] || "/images/hero_sneaker.png"}
                alt={product.name}
                fill
                className="object-contain drop-shadow-[0_0_40px_rgba(0,242,255,0.15)]"
              />
            </motion.div>

            <div className="flex gap-4 mb-10">
              {[
                { label: "HRS", val: timeLeft.h },
                { label: "MIN", val: timeLeft.m },
                { label: "SEC", val: timeLeft.s },
              ].map((t, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="glass w-16 h-16 flex items-center justify-center rounded-2xl mb-2 border border-white/5">
                    <span className="text-2xl font-heading font-bold">{t.val.toString().padStart(2, '0')}</span>
                  </div>
                  <span className="text-[10px] font-bold text-accent tracking-widest">{t.label}</span>
                </div>
              ))}
            </div>

            <Link href={`/product/${product._id}`} className="relative z-10 w-full">
              <button className="w-full bg-accent text-black font-heading font-bold py-5 rounded-3xl glow-accent uppercase tracking-widest text-xs">
                SECURE ACCESS - ₹{product.price}
              </button>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
