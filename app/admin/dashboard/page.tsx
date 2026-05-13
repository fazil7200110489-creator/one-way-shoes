"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, 
  Package, 
  Users, 
  CreditCard, 
  TrendingUp, 
  AlertCircle,
  Menu,
  Bell,
  Search,
  LayoutDashboard,
  LogOut
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Total Orders", value: "1,284", icon: BarChart3, color: "text-blue-400" },
  { label: "Customers", value: "852", icon: Users, color: "text-purple-400" },
  { label: "Total Products", value: "48", icon: Package, color: "text-accent" },
  { label: "Pending Payments", value: "12", icon: CreditCard, color: "text-yellow-400" },
];

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar - Hidden on mobile, but this is mobile first. So I'll make a bottom bar or a drawer */}
      
      <div className="flex-1 px-6 py-10 pb-32">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl font-heading font-black tracking-tighter uppercase">DASHBOARD</h1>
            <p className="text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase">SYSTEM OVERVIEW</p>
          </div>
          <div className="flex gap-4">
            <button className="glass p-3 rounded-2xl relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="glass p-3 rounded-2xl">
              <User size={20} />
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-3xl p-6"
            >
              <stat.icon className={`${stat.color} mb-4`} size={24} />
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-heading font-black">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Alerts / Notifications */}
        <div className="glass-dark rounded-[2.5rem] p-8 mb-10 border border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="text-red-400" size={20} />
            <h2 className="text-sm font-black tracking-widest uppercase">System Alerts</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
              <div>
                <p className="text-xs font-bold">Low Stock: CYBER CORE X1</p>
                <p className="text-[10px] text-white/40">Only 2 units remaining</p>
              </div>
              <Link href="/admin/products" className="text-accent text-[10px] font-bold underline">RESTOCK</Link>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
              <div>
                <p className="text-xs font-bold">Unverified Payment</p>
                <p className="text-[10px] text-white/40">Order #8921 from Sarah Chen</p>
              </div>
              <Link href="/admin/orders" className="text-accent text-[10px] font-bold underline">VERIFY</Link>
            </div>
          </div>
        </div>

        {/* Recent Orders Chart Placeholder */}
        <div className="glass rounded-[2.5rem] p-8 h-64 flex flex-col justify-between overflow-hidden relative">
          <h2 className="text-sm font-black tracking-widest uppercase mb-4">Revenue Analytics</h2>
          <div className="flex-1 flex items-end gap-2">
            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.1 + 0.5, duration: 1 }}
                className="flex-1 bg-gradient-to-t from-accent to-accent/20 rounded-t-lg"
              />
            ))}
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,rgba(0,242,255,0.05)_0%,transparent_70%)] pointer-events-none" />
        </div>
      </div>

      {/* Admin Bottom Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[450px] glass-dark rounded-full px-8 py-4 z-50 flex justify-between items-center border border-white/10 shadow-2xl">
        <Link href="/admin/dashboard" className="text-accent"><LayoutDashboard size={24} /></Link>
        <Link href="/admin/products" className="text-white/40"><Package size={24} /></Link>
        <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center -mt-12 border-4 border-[#050505] shadow-xl">
          <TrendingUp size={24} className="text-black" />
        </div>
        <Link href="/admin/orders" className="text-white/40"><CreditCard size={24} /></Link>
        <Link href="/" className="text-white/40"><LogOut size={24} /></Link>
      </div>
    </main>
  );
}

function User({ size, className }: { size?: number, className?: string }) {
  return <Users size={size} className={className} />
}
