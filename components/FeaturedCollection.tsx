"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { sneakers } from "@/lib/data";
import Link from "next/link";

export default function FeaturedCollection() {
  const featured = sneakers.filter(s => s.featured);

  return (
    <section className="py-20 px-6 overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent/5 blur-[120px] pointer-events-none" />
      
      <div className="flex justify-between items-end mb-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-heading font-black tracking-tighter uppercase leading-none mb-2">Featured</h2>
          <p className="text-white/20 text-[10px] font-black tracking-[0.4em] uppercase">SS26 Collection</p>
        </motion.div>
        <Link href="/shop">
          <button className="text-accent text-[10px] font-black tracking-[0.2em] uppercase py-2 px-4 glass rounded-full">
            VIEW ALL
          </button>
        </Link>
      </div>

      <div className="flex gap-8 overflow-x-auto pb-12 hide-scrollbar snap-x">
        {featured.map((shoe, idx) => (
          <motion.div
            key={shoe.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: idx * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 w-[280px] snap-center group"
          >
            <Link href={`/product/${shoe.id}`}>
              <div className="glass rounded-[2.5rem] p-6 relative overflow-hidden transition-all duration-500 group-hover:scale-[0.98]">
                {/* Status Badges */}
                <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
                  {shoe.limited && (
                    <span className="bg-accent text-black text-[7px] font-black px-2 py-1 rounded-full tracking-[0.2em] uppercase">
                      Limited
                    </span>
                  )}
                  {shoe.trending && (
                    <span className="bg-white/10 backdrop-blur-md text-white text-[7px] font-black px-2 py-1 rounded-full border border-white/5 tracking-[0.2em] uppercase">
                      Trending
                    </span>
                  )}
                </div>

                <div className="absolute top-5 right-5 z-20">
                   <div className="flex items-center gap-1 glass-dark px-2 py-1 rounded-full border border-white/5">
                      <Star size={8} fill="#FFD700" className="text-[#FFD700]" />
                      <span className="text-[8px] font-black">{shoe.rating}</span>
                    </div>
                </div>
                
                <div className="relative aspect-square mb-6">
                  <div className="absolute inset-0 bg-white/[0.01] rounded-full blur-3xl group-hover:bg-accent/[0.03] transition-colors duration-700" />
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={shoe.image}
                      alt={shoe.name}
                      fill
                      className="object-contain filter drop-shadow-[0_20px_40px_rgba(255,255,255,0.05)]"
                    />
                  </motion.div>
                </div>

                <div className="relative z-10 space-y-1">
                  <h3 className="font-heading font-black text-lg tracking-tighter uppercase leading-none">{shoe.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-white/20 font-bold tracking-widest text-[10px]">${shoe.price}</span>
                    <span className="text-[8px] font-black text-accent uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View Drop</span>
                  </div>
                </div>
                
                {/* Reveal line on hover */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              </div>
            </Link>
          </motion.div>

        ))}
      </div>
    </section>
  );
}

import { Star } from "lucide-react";

