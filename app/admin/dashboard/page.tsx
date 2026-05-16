"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Package, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Bell,
  Search,
  LogOut,
  Loader2,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import AdminNavbar from "@/components/AdminNavbar";

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
          { label: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: <BarChart3 size={20} />, color: "bg-accent/10 text-accent", trend: "+12%" },
          { label: "Pending", value: activeOrders.toString(), icon: <CreditCard size={20} />, color: "bg-yellow-400/10 text-yellow-400", trend: "Active" },
          { label: "Stock", value: totalInventory.toString(), icon: <Package size={20} />, color: "bg-blue-400/10 text-blue-400", trend: "Units" },
          { label: "Users", value: new Set(orders.map(o => o.customerPhone)).size.toString(), icon: <Users size={20} />, color: "bg-purple-400/10 text-purple-400", trend: "Unique" },
        ]);

        setRecentOrders(orders.slice(0, 5));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white pb-40">
      <div className="absolute inset-0 bg-grain opacity-5 pointer-events-none" />
      
      {/* App Header */}
      <div className="sticky top-0 z-50 glass-dark border-b border-white/5 px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden glass border border-white/10">
            <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-sm font-heading font-black tracking-tighter uppercase leading-none">Admin</h1>
            <p className="text-[8px] font-bold text-accent uppercase tracking-widest mt-1 flex items-center gap-1">
              <div className="w-1 h-1 bg-accent rounded-full animate-pulse" /> Live System
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="glass p-3 rounded-xl text-white/40"><Bell size={18} /></button>
          <button 
            onClick={() => {
              document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
              window.location.href = "/admin/login";
            }}
            className="glass p-3 rounded-xl text-white/40 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="px-6 py-8 space-y-10">
        {/* Welcome Section */}
        <section>
          <h2 className="text-3xl font-heading font-black tracking-tighter uppercase leading-none mb-2">Morning, Boss</h2>
          <p className="text-label tracking-[0.4em]">Here's your system status</p>
        </section>

        {/* Horizontal Scroll Stats */}
        <section className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x -mx-6 px-6">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-40 glass p-6 rounded-3xl h-40 animate-pulse" />
            ))
          ) : stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex-shrink-0 w-40 glass p-6 rounded-3xl snap-center group relative overflow-hidden"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
                {stat.icon}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-heading font-black tracking-tighter">{stat.value}</h3>
              <div className="mt-2 text-[8px] font-black uppercase tracking-widest text-accent flex items-center gap-1">
                <TrendingUp size={10} /> {stat.trend}
              </div>
            </motion.div>
          ))}
        </section>

        {/* Quick Actions Card */}
        <section className="glass rounded-[2.5rem] p-8 border border-accent/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={80} className="text-accent" />
          </div>
          <div className="relative z-10">
            <h2 className="text-lg font-heading font-black tracking-tighter uppercase mb-2">Growth Center</h2>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] mb-6">Manage your business metrics</p>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/admin/products" className="bg-white text-black py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest active:scale-95 transition-transform">
                <Package size={14} /> Catalog
              </Link>
              <Link href="/admin/orders" className="glass py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest active:scale-95 transition-transform">
                <CreditCard size={14} /> Revenue
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Activity Feed */}
        <section className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-sm font-black uppercase tracking-[0.3em]">Live Feed</h2>
            <Link href="/admin/orders" className="text-[10px] font-bold text-accent uppercase flex items-center gap-1">
              View All <ChevronRight size={12} />
            </Link>
          </div>
          
          <div className="space-y-3">
            {loading ? (
               [...Array(3)].map((_, i) => (
                <div key={i} className="glass p-5 rounded-2xl h-20 animate-pulse" />
              ))
            ) : recentOrders.length > 0 ? recentOrders.map((order, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-5 rounded-3xl flex items-center justify-between group active:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xs font-black group-hover:text-accent transition-colors relative overflow-hidden">
                    {order.customerName.charAt(0)}
                    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-tight">{order.customerName}</p>
                    <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-0.5">{order.productName}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="text-sm font-black text-white/90">₹{order.amount}</p>
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                    order.status === 'Verified' ? 'bg-green-500/10 text-green-400' : 
                    order.status === 'Pending' ? 'bg-yellow-400/10 text-yellow-400' : 
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </motion.div>
            )) : (
              <div className="py-16 glass rounded-[2.5rem] text-center space-y-4 opacity-20 border-dashed border-white/10">
                <Package size={48} className="mx-auto" />
                <p className="text-xs font-black uppercase tracking-[0.2em]">No Recent Activity</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <AdminNavbar />
    </main>
  );
}
