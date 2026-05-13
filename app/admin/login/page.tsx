"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      router.push("/admin/dashboard");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] relative z-10"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-black tracking-tighter mb-2">ONE WAY</h1>
          <p className="text-accent text-[10px] font-bold tracking-[0.5em] uppercase">Control Center</p>
        </div>

        <div className="glass rounded-[2.5rem] p-10 space-y-8">
          <h2 className="text-xl font-heading font-bold text-center">ADMIN AUTHENTICATION</h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-4">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  type="text"
                  placeholder="admin_id"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-4">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-heading font-black py-5 rounded-3xl flex items-center justify-center gap-2 glow-white disabled:opacity-50"
            >
              {loading ? "AUTHENTICATING..." : "SYSTEM LOGIN"} 
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-12 text-[10px] text-white/20 tracking-[0.2em] font-bold uppercase">
          Unauthorized Access is Strictly Prohibited
        </p>
      </motion.div>
    </main>
  );
}
