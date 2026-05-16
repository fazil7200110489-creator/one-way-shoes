"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  CreditCard, 
  BarChart3,
  Settings
} from "lucide-react";
import { motion } from "framer-motion";

interface AdminNavbarProps {}

export default function AdminNavbar({}: AdminNavbarProps) {
  const pathname = usePathname();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Home", href: "/admin/dashboard" },
    { icon: <Package size={20} />, label: "Catalog", href: "/admin/products" },
    { icon: <CreditCard size={20} />, label: "Orders", href: "/admin/orders" },
    { icon: <BarChart3 size={20} />, label: "Data", href: "/admin/analytics" },
    { icon: <Settings size={20} />, label: "Settings", href: "/admin/settings" },
  ];

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 w-full px-6 pb-8 pt-4 z-[100] pointer-events-none">
        <div className="max-w-[500px] mx-auto glass-dark rounded-[2.5rem] p-2 flex justify-between items-center border border-white/10 shadow-2xl pointer-events-auto relative">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className="relative flex flex-col items-center justify-center py-3 px-4 flex-1 group"
              >
                <div className={`transition-all duration-300 ${active ? "text-accent scale-110 -translate-y-1" : "text-white/30 group-hover:text-white/60"}`}>
                  {item.icon}
                </div>
                <span className={`text-[8px] font-black uppercase tracking-widest mt-1 transition-all duration-300 ${active ? "text-accent opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
                  {item.label}
                </span>
                {active && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute -top-1 w-1 h-1 bg-accent rounded-full glow-accent"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
