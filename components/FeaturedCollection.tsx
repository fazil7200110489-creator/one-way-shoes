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
        <button className="text-accent text-[10px] font-black tracking-[0.2em] uppercase py-2 px-4 glass rounded-full">
          VIEW ALL
        </button>
      </div>

      <div className="flex gap-8 overflow-x-auto pb-12 hide-scrollbar snap-x">
        {featured.map((shoe, idx) => (
          <motion.div
            key={shoe.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: idx * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 w-[300px] snap-center group"
          >
            <Link href={`/product/${shoe.id}`}>
              <div className="glass rounded-[3rem] p-8 relative overflow-hidden transition-all duration-500 group-hover:scale-[0.98]">
                <div className="absolute top-6 right-6 z-20">
                  <span className="bg-white/10 backdrop-blur-md text-white text-[8px] font-black px-3 py-1.5 rounded-full border border-white/5 tracking-widest">
                    {shoe.limited ? "LIMITED" : "NEW DROP"}
                  </span>
                </div>
                
                <div className="relative aspect-square mb-8">
                  <div className="absolute inset-0 bg-white/[0.02] rounded-full blur-3xl group-hover:bg-accent/[0.05] transition-colors duration-700" />
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={shoe.image}
                      alt={shoe.name}
                      fill
                      className="object-contain filter drop-shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                    />
                  </motion.div>
                </div>

                <div className="relative z-10 space-y-2">
                  <h3 className="font-heading font-black text-2xl tracking-tighter uppercase">{shoe.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 font-bold tracking-widest text-sm">${shoe.price}</span>
                    <div className="flex items-center gap-1.5 glass-dark px-3 py-1 rounded-full">
                      <Star size={10} fill="#FFD700" className="text-[#FFD700]" />
                      <span className="text-[10px] font-black">{shoe.rating}</span>
                    </div>
                  </div>
                </div>
                
                {/* Reveal line on hover */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

import { Star } from "lucide-react";

