"use client";

import { useParams, useRouter } from "next/navigation";
import { sneakers } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ShoppingBag, Share2, Heart, Star, Check } from "lucide-react";

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const shoe = sneakers.find((s) => s.id === params.id) || sneakers[0];
  
  const [selectedSize, setSelectedSize] = useState(shoe.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(shoe.colors[0]);
  const [isOrdering, setIsOrdering] = useState(false);

  const handleWhatsAppOrder = () => {
    const message = `*NEW ORDER - ONE WAY SHOES*%0A%0A*Product:* ${shoe.name}%0A*Price:* $${shoe.price}%0A*Size:* ${selectedSize}%0A*Color:* ${selectedColor}%0A%0A_Please confirm my order._`;
    window.open(`https://wa.me/1234567890?text=${message}`, "_blank");
    setIsOrdering(true);
  };

  return (
    <main className="min-h-screen bg-black text-white pb-32">
      {/* Header */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center glass-dark">
        <button onClick={() => router.back()} className="glass p-2 rounded-full">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-sm font-heading font-black tracking-widest uppercase">{shoe.name}</h1>
        <div className="flex gap-2">
          <button className="glass p-2 rounded-full"><Share2 size={18} /></button>
          <button className="glass p-2 rounded-full"><Heart size={18} /></button>
        </div>
      </nav>

      {/* Hero Image Gallery (Simplified for Mobile) */}
      <div className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-square w-full max-w-[400px] mx-auto px-6"
        >
          <Image
            src={shoe.image}
            alt={shoe.name}
            fill
            className="object-contain drop-shadow-[0_20px_60px_rgba(255,255,255,0.15)]"
          />
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="px-6 space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-4xl font-heading font-black tracking-tighter mb-2">{shoe.name}</h2>
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < Math.floor(shoe.rating) ? "currentColor" : "none"} />)}
              </div>
              <span className="text-xs font-bold text-white/40">{shoe.rating} (120 Reviews)</span>
            </div>
          </div>
          <p className="text-3xl font-heading font-bold text-accent">${shoe.price}</p>
        </div>

        <p className="text-white/60 text-sm leading-relaxed">
          {shoe.description}
        </p>

        {/* Size Selector */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold tracking-widest uppercase">Select Size</h3>
            <span className="text-[10px] text-white/40 underline">Size Guide</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {shoe.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold transition-all duration-300 ${
                  selectedSize === size ? "bg-white text-black scale-110" : "glass text-white/60"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selector */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold tracking-widest uppercase">Select Color</h3>
          <div className="flex gap-4">
            {shoe.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === color ? "border-accent scale-125" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="glass rounded-[2rem] p-6 space-y-3">
          <div className="flex items-center gap-3 text-xs">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <Check size={16} />
            </div>
            <p><span className="font-bold">Free Express Shipping</span> for members</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <Check size={16} />
            </div>
            <p>Estimated delivery: <span className="font-bold">May 18 - May 20</span></p>
          </div>
        </div>
      </div>

      {/* Sticky Order Button */}
      <div className="fixed bottom-0 left-0 w-full px-6 py-8 glass-dark z-50 border-t border-white/5">
        <button
          onClick={handleWhatsAppOrder}
          className="w-full bg-white text-black font-heading font-black py-5 rounded-3xl flex items-center justify-center gap-3 active:scale-95 transition-transform glow-white"
        >
          <ShoppingBag size={20} />
          ORDER VIA WHATSAPP
        </button>
      </div>

      {/* Payment Success Overlay (Simulation) */}
      <AnimatePresence>
        {isOrdering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center px-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mb-8"
            >
              <Check size={48} className="text-black" />
            </motion.div>
            <h2 className="text-3xl font-heading font-black mb-4">ORDER INITIATED</h2>
            <p className="text-white/60 mb-8">We've redirected you to WhatsApp. Please complete the payment steps provided there.</p>
            <button
              onClick={() => router.push("/payment")}
              className="w-full glass py-4 rounded-2xl font-bold mb-4"
            >
              PROCEED TO PAYMENT PAGE
            </button>
            <button onClick={() => setIsOrdering(false)} className="text-white/40 text-sm">Cancel</button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
