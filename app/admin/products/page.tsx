"use client";

import { useState } from "react";
import { sneakers } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Search, X, Camera, Save } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AdminProducts() {
  const [productList, setProductList] = useState(sneakers);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = productList.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white px-6 py-10 pb-32">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-heading font-black tracking-tighter uppercase">INVENTORY</h1>
          <p className="text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase">MANAGE SNEAKERS</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-accent text-black p-3 rounded-2xl glow-accent"
        >
          <Plus size={24} />
        </button>
      </header>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-accent"
        />
      </div>

      {/* Product List */}
      <div className="space-y-4">
        {filteredProducts.map((shoe, idx) => (
          <motion.div
            key={shoe.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass p-4 rounded-[2rem] flex items-center gap-4"
          >
            <div className="relative w-16 h-16 bg-white/5 rounded-xl overflow-hidden flex-shrink-0">
              <Image src={shoe.image} alt={shoe.name} fill className="object-contain p-1" />
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="font-heading font-bold text-sm truncate uppercase">{shoe.name}</h3>
              <div className="flex items-center gap-3">
                <span className="text-accent text-xs font-bold">${shoe.price}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${shoe.stock < 10 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                  STOCK: {shoe.stock}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="glass p-2 rounded-xl text-white/60 hover:text-white"><Edit2 size={16} /></button>
              <button className="glass p-2 rounded-xl text-red-400/60 hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl px-6 py-10 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-heading font-black tracking-tighter">ADD NEW SNEAKER</h2>
              <button onClick={() => setIsAdding(false)} className="glass p-2 rounded-full">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-6 pb-20">
              {/* Image Upload Placeholder */}
              <div className="glass rounded-[2rem] h-48 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2">
                <Camera size={32} className="text-white/20" />
                <p className="text-xs font-bold text-white/40 uppercase">Upload Multi-view Images</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-4">Product Name</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-4">Price ($)</label>
                  <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-4">Stock</label>
                  <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-4">Description</label>
                <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none h-32" />
              </div>

              <button className="w-full bg-accent text-black font-heading font-black py-5 rounded-3xl glow-accent flex items-center justify-center gap-2">
                <Save size={20} /> SAVE PRODUCT
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation (Same as Dashboard) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[450px] glass-dark rounded-full px-8 py-4 z-50 flex justify-between items-center border border-white/10 shadow-2xl">
        <Link href="/admin/dashboard" className="text-white/40"><LayoutDashboard size={24} /></Link>
        <Link href="/admin/products" className="text-accent"><Package size={24} /></Link>
        <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center -mt-12 border-4 border-[#050505] shadow-xl">
          <Plus size={24} className="text-black" />
        </div>
        <Link href="/admin/orders" className="text-white/40"><CreditCard size={24} /></Link>
        <Link href="/" className="text-white/40"><LogOut size={24} /></Link>
      </div>
    </main>
  );
}

// Re-using components from Dashboard (simulated for simplicity)
import { LayoutDashboard, LogOut, CreditCard } from "lucide-react";
