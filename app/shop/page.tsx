"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, Menu, Star, SlidersHorizontal } from "lucide-react";
import MobileNav from "@/components/MobileNav";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center glass-dark">
        <Link href="/">
          <h1 className="text-xl font-heading font-black tracking-tighter">ONE WAY</h1>
        </Link>
        <div className="flex items-center gap-4">
          <div className="relative glass rounded-full px-4 py-2 flex items-center gap-2 border border-white/5">
            <Search size={16} className="text-white/40" />
            <input 
              type="text" 
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-24 md:w-48 placeholder:text-white/20"
            />
          </div>
        </div>
      </nav>

      <div className="pt-32 px-6 pb-20">
        <header className="mb-12">
          <h2 className="text-5xl font-heading font-black tracking-tighter uppercase mb-4">The Collection</h2>
          <div className="flex justify-between items-center">
            <p className="text-white/40 text-sm tracking-widest uppercase">{filtered.length} Drops available</p>
            <button className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-white/10 text-[10px] font-black tracking-widest">
              <SlidersHorizontal size={14} /> FILTER
            </button>
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[3/4] glass rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {filtered.map((shoe, idx) => (
              <motion.div
                key={shoe._id || shoe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link href={`/product/${shoe._id || shoe.id}`}>
                  <div className="glass rounded-[2.5rem] p-6 relative overflow-hidden group">
                    <div className="relative aspect-square mb-6">
                      <Image
                        src={shoe.images?.[0] || shoe.image}
                        alt={shoe.name}
                        fill
                        className="object-contain transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-heading font-black text-sm tracking-tighter uppercase truncate">{shoe.name}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-accent font-black tracking-tighter text-lg">${shoe.price}</span>
                        <div className="flex items-center gap-1 opacity-40">
                          <Star size={10} fill="currentColor" />
                          <span className="text-[10px] font-bold">{shoe.rating || "5.0"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <MobileNav />
    </main>
  );
}
