"use client";

import { useParams, useRouter } from "next/navigation";
import { sneakers } from "@/lib/data";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useState, useRef } from "react";
import { ChevronLeft, ShoppingBag, Share2, Heart, Star, Check, ArrowRight } from "lucide-react";

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
        className="fixed bottom-0 left-0 w-full px-6 py-10 glass-dark z-50 border-t border-white/5"
      >
        <button
          onClick={handleWhatsAppOrder}
          className="w-full bg-white text-black font-heading font-black py-6 rounded-3xl flex items-center justify-center gap-4 active:scale-[0.98] transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)] group"
        >
          <ShoppingBag size={24} />
          ORDER VIA WHATSAPP
          <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </motion.div>

      {/* Immersive Success Overlay */}
      <AnimatePresence>
        {isOrdering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center px-10 text-center"
          >
            <div className="absolute inset-0 bg-grain opacity-10" />
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 12, delay: 0.2 }}
              className="w-32 h-32 bg-accent rounded-full flex items-center justify-center mb-12 glow-accent"
            >
              <Check size={64} className="text-black" />
            </motion.div>
            <h2 className="text-4xl font-heading font-black tracking-tighter mb-4 uppercase">Order Initialized</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-12 tracking-wide">
              We have redirected you to our priority WhatsApp concierge. Please complete your payment details there.
            </p>
            <div className="w-full space-y-4">
              <button
                onClick={() => router.push("/payment")}
                className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em]"
              >
                Go to Payment
              </button>
              <button 
                onClick={() => setIsOrdering(false)} 
                className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase"
              >
                Close Window
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

