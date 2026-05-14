"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { sneakers } from "@/lib/data";
import { Heart, ShoppingBag, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function TrendingShoes() {
  const trending = sneakers.filter(s => s.trending);

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 blur-[150px] pointer-events-none" />
      
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-heading font-black tracking-tighter uppercase leading-none mb-2">Trending</h2>
          <p className="text-label tracking-[0.4em]">Most Wanted Right Now</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {trending.map((shoe, idx) => (
          <motion.div
            key={shoe.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: idx * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href={`/product/${shoe.id}`}>
              <div className="glass-dark rounded-[2.5rem] p-4 flex gap-6 items-center group relative overflow-hidden active:scale-[0.98] transition-all border border-white/5">
                <div className="relative w-24 h-24 bg-white/[0.02] rounded-2xl overflow-hidden flex-shrink-0">
                  <Image
                    src={shoe.image}
                    alt={shoe.name}
                    fill
                    className="object-contain p-3 group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="flex-1 py-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-heading font-black text-base leading-none uppercase tracking-tighter">{shoe.name}</h3>
                    <ArrowUpRight size={14} className="text-white/10 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-accent font-black text-lg tracking-tighter">${shoe.price}</span>
                    <span className="text-[7px] font-bold text-white/20 uppercase tracking-[0.2em]">Verified Drop</span>
                  </div>
                </div>
                
                {/* Background Accent Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/[0.01] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>

  );
}

