"use client";

import { useState, useEffect } from "react";
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
  LogOut,
  Loader2,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders")
      ]);
      
      const products = await productsRes.json();
      const orders = await ordersRes.json();

      if (Array.isArray(orders) && Array.isArray(products)) {
        const totalRevenue = orders
          .filter((o: any) => o.status === "Verified")
          .reduce((acc: number, o: any) => acc + (o.amount || 0), 0);
        
        const activeOrders = orders.filter((o: any) => o.status === "Pending").length;
        const totalInventory = products.reduce((acc: number, p: any) => acc + (p.stock || 0), 0);

        setStats([
          { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: <BarChart3 size={24} />, color: "text-accent" },
          { label: "Pending Orders", value: activeOrders.toString(), icon: <CreditCard size={24} />, color: "text-yellow-400" },
          { label: "Inventory", value: totalInventory.toString(), icon: <Package size={24} />, color: "text-blue-400" },
          { label: "Customers", value: new Set(orders.map(o => o.customerPhone)).size.toString(), icon: <Users size={24} />, color: "text-purple-400" },
        ]);

        setRecentOrders(orders.slice(0, 3));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white px-6 py-10 pb-32">
      <div className="absolute inset-0 bg-grain opacity-5 pointer-events-none" />
      
      {/* Header */}
      <header className="flex justify-between items-center mb-12 relative z-10">
        <div>
          <h1 className="text-2xl font-heading font-black tracking-tighter uppercase">CONTROL CENTER</h1>
          <p className="text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase">SYSTEM ANALYTICS</p>
        </div>
        <div className="flex gap-4">
          <button className="glass p-3 rounded-2xl relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full glow-accent" />
          </button>
          <div className="w-12 h-12 rounded-2xl overflow-hidden glass border border-white/10">
            <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-10 relative z-10">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="glass p-6 rounded-[2.5rem] h-32 animate-pulse" />
          ))
        ) : stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-6 rounded-[2.5rem] group hover:bg-white/5 transition-colors"
          >
            <div className={`mb-4 ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-heading font-black tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Alerts & Quick Actions */}
      <div className="space-y-6 relative z-10">
        <div className="glass-dark rounded-[2.5rem] p-8 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-accent" size={18} />
              <h2 className="text-[10px] font-black tracking-[0.3em] uppercase">Pending Verification</h2>
            </div>
            <Link href="/admin/orders" className="text-[10px] font-bold text-white/20 hover:text-white uppercase tracking-widest transition-colors">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentOrders.length > 0 ? recentOrders.map((order, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                <div>
                  <p className="text-xs font-bold uppercase">{order.customerName}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-tight">{order.productName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-accent font-black text-xs">${order.amount}</span>
                  <ChevronRight size={14} className="text-white/20" />
                </div>
              </div>
            )) : (
              <p className="text-center py-4 text-xs font-bold text-white/20 uppercase tracking-widest">No recent orders</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/admin/products" className="glass p-6 rounded-[2.5rem] flex flex-col items-center justify-center text-center group active:scale-95 transition-all">
            <Package size={24} className="mb-3 text-white/20 group-hover:text-accent transition-colors" />
            <p className="text-[10px] font-black uppercase tracking-widest">Products</p>
          </Link>
          <Link href="/admin/orders" className="glass p-6 rounded-[2.5rem] flex flex-col items-center justify-center text-center group active:scale-95 transition-all">
            <CreditCard size={24} className="mb-3 text-white/20 group-hover:text-accent transition-colors" />
            <p className="text-[10px] font-black uppercase tracking-widest">Orders</p>
          </Link>
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
