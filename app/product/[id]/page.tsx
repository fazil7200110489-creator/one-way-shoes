"use client";

import { useParams, useRouter } from "next/navigation";
import { sneakers } from "@/lib/data";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useState, useRef } from "react";
import { ChevronLeft, ShoppingBag, Share2, Heart, Star, Check, ArrowRight } from "lucide-react";
import Link from "next/link";

import React from "react";

export default function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const shoe = sneakers.find((s) => s.id === id) || sneakers[0];
  
  // Note: Client components inside here would need to be updated too if they use hooks incorrectly
  // But this is a "use client" page, so it should be handled differently.

  
  const [selectedSize, setSelectedSize] = useState(shoe.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(shoe.colors[0]);
  const [isOrdering, setIsOrdering] = useState(false);

  const handleWhatsAppOrder = async () => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: "Guest User",
          customerPhone: "Not Provided",
          productId: shoe.id,
          productName: shoe.name,
          size: selectedSize,
          color: selectedColor,
          amount: shoe.price,
          status: "Pending"
        })
      });
      
      if (res.ok) {
        const message = `*ONE WAY SHOES ORDER*%0A%0A*Model:* ${shoe.name}%0A*Size:* ${selectedSize}%0A*Color:* ${selectedColor}%0A*Price:* $${shoe.price}%0A%0A_Please verify my order details._`;
        window.open(`https://wa.me/1234567890?text=${message}`, "_blank");
        setIsOrdering(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-accent selection:text-black">
      <div className="absolute inset-0 bg-grain pointer-events-none z-0" />
      
      {/* Immersive Header */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-8 flex justify-between items-center transition-all duration-500">
        <button onClick={() => router.back()} className="glass w-12 h-12 flex items-center justify-center rounded-full active:scale-90 transition-transform">
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-3">
          <button className="glass w-12 h-12 flex items-center justify-center rounded-full"><Share2 size={20} /></button>
          <button className="glass w-12 h-12 flex items-center justify-center rounded-full"><Heart size={20} /></button>
        </div>
      </nav>

      {/* Fullscreen Hero Product Gallery */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center pt-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(0,242,255,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <motion.div
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.2}
          whileTap={{ cursor: "grabbing" }}
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: -10 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-square w-full max-w-[500px] z-10 cursor-grab px-8"
        >
          <motion.div
            animate={{
              y: [-15, 15, -15],
              rotate: [-10, -8, -10],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-full h-full"
          >
            <Image
              src={shoe.image}
              alt={shoe.name}
              fill
              className="object-contain drop-shadow-[0_40px_100px_rgba(255,255,255,0.2)]"
            />
          </motion.div>
        </motion.div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <span className="text-[10px] font-black tracking-[0.4em] uppercase">Interactive 3D View</span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i === 0 ? "w-6 bg-white" : "w-1 bg-white/20"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Product Content with Reveal Animation */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 bg-gradient-to-t from-black via-black to-transparent px-6 pb-40"
      >
        <div className="space-y-10">
          <div className="flex justify-between items-end">
            <div>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="text-accent font-black text-[10px] tracking-[0.4em] uppercase mb-2 block"
              >
                Limited Release
              </motion.span>
              <h2 className="text-5xl font-heading font-black tracking-tighter leading-none">{shoe.name}</h2>
            </div>
            <p className="text-4xl font-heading font-black text-white/90">${shoe.price}</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex gap-1 text-accent">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <span className="h-4 w-[1px] bg-white/10" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">120+ Verified Orders</span>
          </div>

          <p className="text-white/60 text-sm leading-relaxed max-w-sm">
            {shoe.description} Engineered with adaptive cushioning and high-tensile carbon fiber plates for the ultimate performance.
          </p>

          {/* Luxury Size Selector */}
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40">Select Size</h3>
              <span className="text-[10px] font-bold underline text-white/60">FIT GUIDE</span>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {shoe.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`aspect-square rounded-2xl flex items-center justify-center font-black transition-all duration-500 ${
                    selectedSize === size 
                      ? "bg-white text-black scale-110 shadow-[0_0_20px_rgba(255,255,255,0.4)]" 
                      : "glass text-white/40 border-white/5"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40 px-2">Select Palette</h3>
            <div className="flex gap-6 px-2">
              {shoe.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-12 h-12 rounded-full border-4 transition-all duration-500 relative ${
                    selectedColor === color ? "border-white scale-110" : "border-white/5"
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <motion.div layoutId="color-check" className="absolute -top-1 -right-1 bg-white text-black rounded-full p-1 shadow-xl">
                      <Check size={10} strokeWidth={4} />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sticky Bottom Order Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-0 left-0 w-full px-6 py-8 pb-12 glass-dark z-50 border-t border-white/5 md:hidden"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-label">Total Price</span>
            <span className="text-2xl font-heading font-black">${shoe.price}</span>
          </div>
          <button
            onClick={handleWhatsAppOrder}
            className="flex-1 bg-white text-black font-heading font-black py-5 rounded-3xl flex items-center justify-center gap-3 active:scale-[0.98] transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)] group"
          >
            <ShoppingBag size={20} />
            ORDER NOW
          </button>
        </div>
      </motion.div>

      {/* Related Products */}
      <section className="px-6 py-24 pb-48">
        <h3 className="text-label mb-8 px-2">Complete the Look</h3>
        <div className="flex gap-6 overflow-x-auto hide-scrollbar snap-x">
          {sneakers.filter(s => s.id !== shoe.id).slice(0, 3).map((s) => (
            <Link key={s.id} href={`/product/${s.id}`} className="flex-shrink-0 w-[200px] snap-center">
              <div className="glass rounded-[2rem] p-4 space-y-4">
                <div className="relative aspect-square">
                  <Image src={s.image} alt={s.name} fill className="object-contain" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest truncate">{s.name}</p>
                  <p className="text-accent font-bold text-xs">${s.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Success / Payment Instruction Modal */}
      <AnimatePresence>
        {isOrdering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center px-8 text-center"
          >
            <div className="absolute inset-0 bg-grain opacity-10 pointer-events-none" />
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass p-10 rounded-[3rem] w-full max-w-sm space-y-8"
            >
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Check size={40} className="text-accent" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-heading font-black tracking-tighter uppercase">ORDER INITIATED</h2>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Next Steps</p>
              </div>

              <div className="space-y-4 text-left">
                <div className="flex gap-4 items-start">
                  <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0">1</div>
                  <p className="text-[11px] text-white/60 leading-relaxed uppercase tracking-wide">Redirecting to WhatsApp to confirm your sizing and address.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0">2</div>
                  <p className="text-[11px] text-white/60 leading-relaxed uppercase tracking-wide">Secure payment link or QR will be provided in chat.</p>
                </div>
              </div>

              <button
                onClick={() => {
                  const message = `*ONE WAY SHOES ORDER*%0A%0A*Model:* ${shoe.name}%0A*Size:* ${selectedSize}%0A*Color:* ${selectedColor}%0A*Price:* $${shoe.price}%0A%0A_Please verify my order details._`;
                  window.open(`https://wa.me/1234567890?text=${message}`, "_blank");
                  setIsOrdering(false);
                }}
                className="w-full bg-accent text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px]"
              >
                PROCEED TO CHAT
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}

