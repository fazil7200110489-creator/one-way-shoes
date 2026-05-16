"use client";

import { useState } from "react";
import { Home, Search, Heart, User, LayoutDashboard, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { motion } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileNav() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  if (pathname.startsWith("/admin") || pathname.startsWith("/product/")) return null;

  const navItems = [
    { icon: <Home size={20} />, label: "Home", href: "/" },
    { icon: <Search size={20} />, label: "Search", action: "search" },
    { icon: <ShoppingBag size={20} />, label: "Shop", href: "/shop" },
    { icon: <Heart size={20} />, label: "Wishlist", href: "/wishlist" },
    { icon: <User size={20} />, label: "Profile", href: "/profile" },
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full z-[100] md:hidden px-4 pb-safe">
        <div className="glass-dark rounded-t-[2.5rem] px-8 py-5 flex justify-between items-center border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {navItems.map((item, idx) => {
            const isActive = pathname === item.href;

            const content = (
              <div className={`transition-all duration-500 ${isActive ? "text-accent scale-110" : "text-white/40 group-hover:text-white"}`}>
                {item.icon}
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute -inset-4 bg-accent/10 blur-xl rounded-full -z-10"
                  />
                )}
              </div>
            );

            if (item.action === "search") {
              return (
                <button key={idx} onClick={() => setIsSearchOpen(true)} className="relative group">
                  {content}
                </button>
              );
            }

            return (
              <Link key={idx} href={item.href || "#"} className="relative group">
                {content}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Search Overlay Placeholder */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-heading font-black uppercase tracking-tighter">Search Products</h2>
              <button onClick={() => setIsSearchOpen(false)} className="glass w-10 h-10 rounded-full flex items-center justify-center">✕</button>
            </div>
            <input
              type="text"
              autoFocus
              placeholder="Type shoe name..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-xl font-bold focus:outline-none focus:border-accent transition-colors"
            />
            <div className="mt-8">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Suggested</p>
              <div className="flex flex-wrap gap-3 mt-4">
                {["Phantom", "Apex", "Nova", "Cyber"].map(tag => (
                  <span key={tag} className="glass px-4 py-2 rounded-full text-xs font-bold text-accent">#{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
