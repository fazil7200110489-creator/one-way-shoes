"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { sneakers } from "@/lib/data";
import { Heart, ShoppingBag } from "lucide-react";

export default function TrendingShoes() {
  const trending = sneakers.filter(s => s.trending);

  return (
    <section className="py-20 px-6 bg-secondary/50">
      <div className="mb-10">
        <h2 className="text-3xl font-heading font-black tracking-tight">TRENDING</h2>
        <p className="text-white/40 text-sm">Most wanted right now</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {trending.map((shoe, idx) => (
          <motion.div
            key={shoe.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-dark rounded-[2.5rem] p-4 flex gap-4 items-center group relative"
          >
            <div className="relative w-1/3 aspect-square bg-white/5 rounded-[2rem] overflow-hidden">
              <Image
                src={shoe.image}
                alt={shoe.name}
                fill
                className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <div className="flex-1 py-2">
              <h3 className="font-heading font-bold text-lg mb-1 leading-tight">{shoe.name}</h3>
              <p className="text-accent font-bold mb-3">${shoe.price}</p>
              
              <div className="flex gap-2 mb-4">
                {shoe.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full border border-white/20"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button className="bg-white text-black p-2 rounded-xl flex-1 text-xs font-bold flex items-center justify-center gap-2">
                  <ShoppingBag size={14} /> ORDER NOW
                </button>
                <button className="glass p-2 rounded-xl">
                  <Heart size={14} className="text-white/60" />
                </button>
              </div>
            </div>
            
            {/* Background Glow on hover */}
            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] -z-10" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
