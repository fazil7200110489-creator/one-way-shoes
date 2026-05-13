"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, Copy, Check, Upload, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const upiId = "oneway@upi";

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <nav className="flex items-center justify-between mb-12">
        <button onClick={() => router.back()} className="glass p-2 rounded-full">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-heading font-black tracking-tighter">SECURE PAYMENT</h1>
        <div className="w-10" />
      </nav>

      <div className="space-y-10">
        {/* UPI Section */}
        <div className="flex flex-col items-center">
          <div className="glass p-6 rounded-[2.5rem] mb-6 relative">
            <div className="w-64 h-64 bg-white rounded-3xl flex items-center justify-center overflow-hidden">
              {/* Dummy QR Code */}
              <div className="w-48 h-48 border-4 border-black relative">
                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-black" />
                <div className="absolute top-0 right-0 w-12 h-12 border-4 border-black" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-4 border-black" />
                <div className="absolute inset-4 grid grid-cols-4 grid-rows-4 gap-1 opacity-50">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="bg-black" style={{ opacity: Math.random() }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-black px-4 py-1 rounded-full text-[10px] font-black tracking-widest">
              SCAN TO PAY
            </div>
          </div>

          <div className="w-full glass rounded-3xl p-6 flex flex-col items-center gap-4">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest">UPI ID</p>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-heading font-bold">{upiId}</span>
              <button onClick={handleCopy} className="text-accent">
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <h2 className="text-xs font-black tracking-widest text-accent uppercase">Steps to confirm order</h2>
          <ol className="space-y-4">
            {[
              "Scan the QR code or copy the UPI ID",
              "Pay the total amount in your UPI app",
              "Take a screenshot of the payment",
              "Upload the screenshot below",
            ].map((step, idx) => (
              <li key={idx} className="flex gap-4 text-sm text-white/70">
                <span className="text-accent font-bold">0{idx + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Upload Section */}
        <div className="glass rounded-[2rem] p-8 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/40">
            <Upload size={32} />
          </div>
          <div>
            <p className="text-sm font-bold">Upload Screenshot</p>
            <p className="text-xs text-white/40">JPG, PNG or PDF (Max 5MB)</p>
          </div>
        </div>

        {/* Confirmation Button */}
        <button
          onClick={() => setIsPaid(true)}
          className="w-full bg-accent text-black font-heading font-black py-5 rounded-3xl glow-accent flex items-center justify-center gap-2"
        >
          I HAVE PAID <ArrowRight size={20} />
        </button>
      </div>

      {/* Success Modal */}
      {isPaid && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center px-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mb-8"
          >
            <Check size={48} className="text-black" />
          </motion.div>
          <h2 className="text-4xl font-heading font-black mb-4">REQUEST SUBMITTED</h2>
          <p className="text-white/60 mb-10 leading-relaxed">
            Our team will verify your payment within 15 minutes. You'll receive a confirmation on WhatsApp.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full glass py-4 rounded-2xl font-bold"
          >
            RETURN TO HOME
          </button>
        </div>
      )}
    </main>
  );
}
