"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { sneakers } from "@/lib/data";

export default function FeaturedCollection() {
  const featured = sneakers.filter(s => s.featured);

  return (
    <section className="py-20 px-6 overflow-hidden">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-heading font-black tracking-tight">FEATURED</h2>
          <p className="text-white/40 text-sm">Exclusive drops this season</p>
        </div>
        <button className="text-accent text-xs font-bold tracking-widest">VIEW ALL</button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar snap-x">
        {featured.map((shoe, idx) => (
          <motion.div
            key={shoe.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex-shrink-0 w-[280px] snap-center"
          >
            <div className="glass rounded-3xl p-6 relative overflow-hidden group">
              <div className="absolute top-4 right-4 z-20">
                <span className="bg-accent/20 text-accent text-[10px] font-bold px-2 py-1 rounded-full border border-accent/30">
                  LIMITED
                </span>
              </div>
              
              <div className="relative aspect-square mb-6 group-hover:scale-110 transition-transform duration-500">
                <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
                <Image
                  src={shoe.image}
                  alt={shoe.name}
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </div>

              <div className="relative z-10">
                <h3 className="font-heading font-bold text-xl mb-1">{shoe.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 font-medium">${shoe.price}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-xs font-bold">{shoe.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
