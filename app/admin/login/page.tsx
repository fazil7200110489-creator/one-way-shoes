"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, ArrowRight, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple demo auth - in production use proper API + JWT
    if (username === "admin" && password === "oneway2026") {
      document.cookie = "admin_session=true; path=/; max-age=86400"; // 24h
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grain opacity-5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(0,242,255,0.03)_0%,transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] z-10"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-black tracking-tighter uppercase mb-2">CONTROL CENTER</h1>
          <p className="text-[10px] font-bold text-white/40 tracking-[0.4em] uppercase">Authentication Required</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="glass rounded-[2rem] p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-white/40 uppercase tracking-[0.4em] ml-4">Username</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-accent/30 transition-all"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-bold text-white/40 uppercase tracking-[0.4em] ml-4">Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-accent/30 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-[10px] font-bold text-center uppercase tracking-widest"
              >
                {error}
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-6 rounded-3xl font-heading font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-[0.98] transition-all glow-soft"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                AUTHENTICATE <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
