"use client";

import { Home, Search, Heart, User, LayoutDashboard, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function MobileNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  const navItems = [
    { icon: <Home size={20} />, label: "Home", href: "/" },
    { icon: <Search size={20} />, label: "Search", href: "#" },
    { icon: <ShoppingBag size={20} />, label: "Shop", href: "#" },
    { icon: <Heart size={20} />, label: "Saved", href: "#" },
    { icon: <User size={20} />, label: "Admin", href: "/admin/dashboard" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-[100] md:hidden">
      <div className="glass-dark rounded-full px-8 py-4 flex justify-between items-center border border-white/10 shadow-2xl relative overflow-hidden">
        {navItems.map((item, idx) => {
          const isActive = pathname === item.href;
          return (
            <Link key={idx} href={item.href} className="relative group">
              <div className={`transition-all duration-500 ${isActive ? "text-accent scale-110" : "text-white/40 group-hover:text-white"}`}>
                {item.icon}
              </div>
              {isActive && (
                <motion.div
                  layoutId="nav-glow"
                  className="absolute -inset-4 bg-accent/10 blur-xl rounded-full -z-10"
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
