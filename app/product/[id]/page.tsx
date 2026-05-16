"use client";

import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeft, ShoppingBag, Share2, Heart, Star, Check, ArrowRight, Box } from "lucide-react";
import Link from "next/link";
import React from "react";
import Shoe3DViewer from "@/components/Shoe3DViewer";
import Product3DModel from "@/components/Product3DModel";

export default function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  
  const [shoe, setShoe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isOrdering, setIsOrdering] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [orderStep, setOrderStep] = useState(1); // 1: Info, 2: Payment, 3: Success
  const [validationError, setValidationError] = useState("");
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  const deliveryCharge = 15;
  const subtotal = shoe ? shoe.price * quantity : 0;
  const totalAmount = subtotal + deliveryCharge;

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        setShoe(data);
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
      
    fetch(`/api/products`)
      .then(res => res.json())
      .then(data => {
        setRelatedProducts(data.filter((s: any) => s._id !== id).slice(0, 3));
      });
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-accent rounded-full animate-spin" />
      </main>
    );
  }

  if (error || !shoe) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-black">Product Not Found</h1>
        <button onClick={() => router.push("/shop")} className="text-accent underline">Back to Shop</button>
      </main>
    );
  }

  const handleInitiateOrder = () => {
    if (!selectedSize) {
      setValidationError("Please select a size first");
      return;
    }
    if (shoe.colors?.length > 0 && !selectedColor) {
      setValidationError("Please select a color first");
      return;
    }
    setValidationError("");
    setIsPaymentModalOpen(true);
    setOrderStep(1);
  };

  const handleUploadScreenshot = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentScreenshot(file);
    }
  };

  const handleOrderSubmit = async () => {
    if (!customerName || !customerPhone) {
      setValidationError("Name and phone are required");
      return;
    }
    if (!paymentScreenshot) {
      setValidationError("Please upload payment screenshot");
      return;
    }

    setIsUploading(true);
    setValidationError("");

    try {
      // 1. Upload to Supabase
      const { getSupabase } = await import("@/lib/supabase");
      const supabase = getSupabase();
      
      const fileExt = paymentScreenshot.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `screenshots/${fileName}`;

      // Image Compression
      const compressImage = (file: File): Promise<Blob> => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            const img = new (window as any).Image();
            img.src = event.target?.result as string;
            img.onload = () => {
              const canvas = document.createElement("canvas");
              const MAX_WIDTH = 1200;
              const MAX_HEIGHT = 1200;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");
              ctx?.drawImage(img, 0, 0, width, height);
              canvas.toBlob((blob) => {
                resolve(blob || file);
              }, "image/jpeg", 0.7);
            };
          };
        });
      };

      const compressedBlob = await compressImage(paymentScreenshot);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, compressedBlob, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("products")
        .getPublicUrl(filePath);

      // 2. Save to MongoDB
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          productId: shoe._id || shoe.id,
          productName: shoe.name,
          size: selectedSize,
          color: selectedColor,
          quantity,
          amount: totalAmount,
          paymentScreenshot: publicUrl,
          status: "Pending Verification"
        })
      });

      if (!res.ok) throw new Error("Failed to save order");

      setScreenshotUrl(publicUrl);
      setOrderStep(3);
      setIsUploading(false);
      
      // WhatsApp redirect will be handled by the "Finish" button in success step
    } catch (err: any) {
      console.error(err);
      setValidationError(err.message || "Something went wrong. Please try again.");
      setIsUploading(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const message = `*ONE WAY SHOES ORDER*%0A%0A*Name:* ${customerName}%0A*Model:* ${shoe.name}%0A*Size:* ${selectedSize}%0A*Color:* ${selectedColor}%0A*Quantity:* ${quantity}%0A*Total:* ₹${totalAmount}%0A*Payment Proof:* ${screenshotUrl}%0A%0A_Please verify my payment and process my order._`;
    window.open(`https://wa.me/7200110489?text=${message}`, "_blank");
    setIsPaymentModalOpen(false);
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

      {/* Fullscreen Hero Product Gallery / 3D Viewer */}
      <section className="relative h-[70vh] md:h-[80vh] flex flex-col items-center justify-center pt-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(0,242,255,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="w-full max-w-[800px] z-10 px-6">
          {shoe.model3DUrl ? (
            <Product3DModel modelUrl={shoe.model3DUrl} />
          ) : shoe.rotationImages && shoe.rotationImages.length > 0 ? (
            <Shoe3DViewer rotationImages={shoe.rotationImages} name={shoe.name} />
          ) : (
            <motion.div
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.2}
              whileTap={{ cursor: "grabbing" }}
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: -10 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-square w-full cursor-grab max-w-[500px] mx-auto"
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
                className="w-full h-full relative"
              >
                <Image
                  src={shoe.images?.[0] || shoe.image || "/images/placeholder.png"}
                  alt={shoe.name}
                  fill
                  className="object-contain drop-shadow-[0_40px_100px_rgba(0,242,255,0.3)]"
                  priority
                />
              </motion.div>
            </motion.div>
          )}
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <span className="text-[10px] font-black tracking-[0.4em] uppercase">
            {shoe.model3DUrl ? "Full 3D Interaction" : shoe.rotationImages && shoe.rotationImages.length > 0 ? "360° Sphere Rotation" : "Interactive Perspective"}
          </span>
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
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div className="flex-1">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="text-accent font-black text-[10px] tracking-[0.4em] uppercase mb-2 block"
              >
                Limited Release
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter leading-none break-words">{shoe.name}</h2>
            </div>
            <p className="text-3xl md:text-4xl font-heading font-black text-white/90">₹{shoe.price}</p>
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
            <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar -mx-6 px-6 snap-x">
              {shoe.sizes?.map((size: number) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center font-black transition-all duration-300 snap-center border ${
                    selectedSize === size 
                      ? "bg-accent text-black border-accent scale-110 shadow-[0_0_30px_rgba(0,242,255,0.4)]" 
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
            <div className="flex gap-5 px-2 overflow-x-auto hide-scrollbar">
              {shoe.colors?.map((color: string) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-14 h-14 rounded-full border-[3px] transition-all duration-500 relative flex-shrink-0 ${
                    selectedColor === color ? "border-accent scale-110 shadow-[0_0_20px_rgba(0,242,255,0.3)]" : "border-white/10"
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <motion.div layoutId="color-check" className="absolute -top-1 -right-1 bg-accent text-black rounded-full p-1 shadow-xl">
                      <Check size={12} strokeWidth={4} />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40 px-2">Quantity</h3>
            <div className="flex items-center gap-6 px-2">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 rounded-xl glass flex items-center justify-center text-xl font-black active:scale-90 transition-transform"
              >
                -
              </button>
              <span className="text-2xl font-black w-8 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(shoe.stock || 10, quantity + 1))}
                className="w-12 h-12 rounded-xl glass flex items-center justify-center text-xl font-black active:scale-90 transition-transform"
              >
                +
              </button>
              {shoe.stock > 0 && shoe.stock < 5 && (
                <span className="text-[10px] font-bold text-accent animate-pulse">ONLY {shoe.stock} LEFT!</span>
              )}
            </div>
          </div>

          {/* Validation Message */}
          <AnimatePresence>
            {validationError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mx-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black tracking-widest uppercase flex items-center gap-2"
              >
                <div className="w-1 h-1 bg-red-500 rounded-full animate-ping" />
                {validationError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium Checkout Section (Now Natural Flow) */}
          <div className="pt-10 mt-10 border-t border-white/5 space-y-8">
            <div className="flex items-center justify-between px-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">Subtotal</span>
                  <span className="text-xs font-black text-white/60">₹{subtotal}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">Delivery</span>
                  <span className="text-xs font-black text-white/60">₹{deliveryCharge}</span>
                </div>
                <div className="mt-1 flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-accent">Total Amount</span>
                  <span className="text-3xl font-heading font-black">₹{totalAmount}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-accent">Selection</span>
                <span className="block text-[11px] font-black text-white/80 uppercase tracking-tighter">Size {selectedSize || '-'}</span>
                <span className="block text-[11px] font-black text-white/80 uppercase tracking-tighter">Quantity {quantity}</span>
              </div>
            </div>
            
            <button
              onClick={handleInitiateOrder}
              className="w-full bg-white text-black font-heading font-black py-7 rounded-[2rem] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-accent/10 opacity-0 group-active:opacity-100 transition-opacity" />
              <ShoppingBag size={24} />
              <span className="tracking-tighter text-xl uppercase">Secure Checkout</span>
            </button>
            
            <p className="text-[8px] font-black text-center text-white/20 uppercase tracking-[0.4em] pt-4">
              Protected by ONE WAY Secure Encryption
            </p>
          </div>
        </div>
      </motion.div>



      {/* Related Products */}
      <section className="px-6 py-24">
        <h3 className="text-label mb-8 px-2">Complete the Look</h3>
        <div className="flex gap-6 overflow-x-auto hide-scrollbar snap-x">
          {relatedProducts.map((s) => (
            <Link key={s._id || s.id} href={`/product/${s._id || s.id}`} className="flex-shrink-0 w-[200px] snap-center">
              <div className="glass rounded-[2rem] p-4 space-y-4">
                <div className="relative aspect-square">
                  <Image src={s.images?.[0] || s.image || "/images/placeholder.png"} alt={s.name} fill className="object-contain" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest truncate">{s.name}</p>
                  <p className="text-accent font-bold text-xs">₹{s.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Premium Order & Payment Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-end md:justify-center p-0 md:p-8"
          >
            <div className="absolute inset-0 bg-grain opacity-10 pointer-events-none" />
            
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="glass w-full max-w-[450px] rounded-t-[3rem] md:rounded-[3rem] p-8 md:p-10 space-y-8 relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsPaymentModalOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 glass rounded-full flex items-center justify-center text-white/40 active:scale-90 transition-transform"
              >
                ✕
              </button>

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
              
              {/* Progress Stepper */}
              <div className="flex justify-between items-center px-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                      orderStep >= step ? "bg-accent text-black shadow-[0_0_15px_rgba(0,242,255,0.5)]" : "glass text-white/20"
                    }`}>
                      {orderStep > step ? <Check size={14} /> : step}
                    </div>
                  </div>
                ))}
              </div>

              {/* Step 1: Customer Details */}
              {orderStep === 1 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h2 className="text-2xl font-heading font-black tracking-tighter uppercase">SHIPPING INFO</h2>
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.3em]">Where should we send your pair?</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black tracking-widest text-white/40 uppercase px-1">Full Name</label>
                      <input 
                        type="text" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="ALEX RIDER"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold tracking-wide focus:outline-none focus:border-accent/50 transition-colors uppercase placeholder:text-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black tracking-widest text-white/40 uppercase px-1">WhatsApp Number</label>
                      <input 
                        type="tel" 
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 00000 00000"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold tracking-wide focus:outline-none focus:border-accent/50 transition-colors uppercase placeholder:text-white/10"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (customerName && customerPhone) setOrderStep(2);
                      else setValidationError("Please fill all fields");
                    }}
                    className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] active:scale-95 transition-transform flex items-center justify-center gap-2"
                  >
                    CONTINUE TO PAYMENT <ArrowRight size={16} />
                  </button>
                </motion.div>
              )}

              {/* Step 2: Payment Instructions & Upload */}
              {orderStep === 2 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <h2 className="text-2xl font-heading font-black tracking-tighter uppercase">SECURE PAYMENT</h2>
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.3em]">Manual UPI Verification</p>
                  </div>

                  <div className="glass p-6 rounded-3xl space-y-6 relative overflow-hidden border-accent/20">
                    <div className="absolute top-0 right-0 p-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                        <Star size={20} className="text-accent" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Amount to Pay</p>
                        <p className="text-4xl font-heading font-black text-accent">₹{totalAmount}</p>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">UPI ID</span>
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">oneway@upi</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">A/C HOLDER</span>
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">ONE WAY SHOES</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl aspect-square w-48 mx-auto shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                      <Image 
                        src="/images/payment_qr.png" 
                        alt="Payment QR" 
                        width={300} 
                        height={300}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[9px] font-black text-center text-white/40 uppercase tracking-[0.2em]">Upload Payment Proof</p>
                    <label className="relative group cursor-pointer block">
                      <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment"
                        onChange={handleUploadScreenshot}
                        className="hidden"
                      />
                      <div className="w-full border-2 border-dashed border-white/10 group-hover:border-accent/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all">
                        {paymentScreenshot ? (
                          <div className="flex items-center gap-3 text-accent">
                            <Check size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[200px]">
                              {paymentScreenshot.name}
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                              <ShoppingBag size={20} className="text-white/40" />
                            </div>
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Tap to Gallery / Camera</span>
                          </>
                        )}
                      </div>
                    </label>
                  </div>

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          className="h-full bg-accent"
                        />
                      </div>
                      <p className="text-[9px] font-black text-accent text-center uppercase tracking-widest">Uploading... {uploadProgress}%</p>
                    </div>
                  )}

                  {validationError && (
                    <p className="text-[10px] font-black text-red-500 text-center uppercase tracking-widest">{validationError}</p>
                  )}

                  <button
                    disabled={isUploading || !paymentScreenshot}
                    onClick={handleOrderSubmit}
                    className="w-full bg-accent text-black py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] active:scale-95 transition-transform disabled:opacity-50 disabled:grayscale disabled:scale-100 shadow-[0_10px_30px_rgba(0,242,255,0.3)]"
                  >
                    {isUploading ? "PROCESSING..." : "SUBMIT ORDER VERIFICATION"}
                  </button>
                </motion.div>
              )}

              {/* Step 3: Success & WhatsApp Redirect */}
              {orderStep === 3 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8 text-center py-4"
                >
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto relative">
                    <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping opacity-20" />
                    <Check size={40} className="text-accent" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-3xl font-heading font-black tracking-tighter uppercase">ORDER PLACED</h2>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Pending Concierge Verification</p>
                  </div>

                  <div className="glass p-6 rounded-3xl text-left space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Order Status</span>
                      <span className="text-[10px] font-black text-accent uppercase tracking-widest">Verification Pending</span>
                    </div>
                    <p className="text-[10px] text-white/60 leading-relaxed uppercase tracking-wide">
                      Our team will verify your payment screenshot within 30 minutes. You will receive a confirmation via WhatsApp.
                    </p>
                  </div>

                  <button
                    onClick={handleWhatsAppRedirect}
                    className="w-full bg-accent text-black py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] active:scale-95 transition-transform flex items-center justify-center gap-2"
                  >
                    FINALIZE ON WHATSAPP <ShoppingBag size={18} />
                  </button>
                </motion.div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}

