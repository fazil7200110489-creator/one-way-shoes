"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  ChevronRight,
  ExternalLink,
  Smartphone,
  Search,
  LogOut,
  Loader2,
  ChevronDown,
  X,
  CreditCard,
  User,
  Package,
  Calendar
} from "lucide-react";
import Image from "next/image";
import AdminNavbar from "@/components/AdminNavbar";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setSelectedOrder(null);
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Verified": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "Rejected": return "text-red-400 bg-red-500/10 border-red-500/20";
      default: return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    }
  };

  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-black text-white pb-40">
      <div className="absolute inset-0 bg-grain opacity-5 pointer-events-none" />

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 glass-dark border-b border-white/5 px-6 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-heading font-black tracking-tighter uppercase leading-none">Revenue</h1>
          <p className="text-[8px] font-bold text-white/40 uppercase tracking-[0.4em] mt-1">Transaction Pipeline</p>
        </div>
        <div className="flex gap-2">
           <button className="glass p-3 rounded-xl text-white/40"><Search size={18} /></button>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Search Field */}
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-5 pl-16 pr-6 outline-none focus:border-accent/30 transition-all font-medium text-sm"
          />
        </div>

        {/* Orders List - Mobile Cards */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="text-xs font-black tracking-widest uppercase">Fetching Transactions...</p>
            </div>
          ) : filteredOrders.length > 0 ? filteredOrders.map((order, idx) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedOrder(order)}
              className="glass p-5 rounded-[2.5rem] space-y-4 group active:bg-white/[0.03] transition-all relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-xs font-black">
                    {order.customerName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-sm uppercase leading-none">{order.customerName}</h3>
                    <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-1">{order._id.slice(-8)}</p>
                  </div>
                </div>
                <span className={`text-[8px] font-black px-3 py-1.5 rounded-full border uppercase tracking-widest ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="flex justify-between items-end pt-2 border-t border-white/5">
                <div>
                   <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{order.productName}</p>
                   <p className="text-lg font-heading font-black text-white/90">${order.amount}</p>
                </div>
                <div className="flex items-center gap-1 text-accent text-[9px] font-black uppercase tracking-widest mb-1">
                   Details <ChevronRight size={12} />
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="py-24 glass rounded-[3rem] text-center space-y-4 opacity-20 border-dashed border-white/10">
                <CreditCard size={48} className="mx-auto" />
                <p className="text-xs font-black uppercase tracking-[0.2em]">No transactions found</p>
            </div>
          )}
        </div>
      </div>

      {/* Immersive Order Verification Sheet */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[200] bg-black flex flex-col"
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-[210] glass-dark border-b border-white/5 px-6 py-6 flex justify-between items-center">
              <button onClick={() => setSelectedOrder(null)} className="glass p-3 rounded-2xl text-white/40"><X size={20} /></button>
              <h2 className="text-sm font-heading font-black tracking-widest uppercase">Verification</h2>
              <button className="glass p-3 rounded-2xl text-accent"><ExternalLink size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 pb-32">
              {/* Status Header */}
              <div className={`p-8 rounded-[3rem] border text-center space-y-2 ${getStatusColor(selectedOrder.status)}`}>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Transaction Status</p>
                 <h3 className="text-2xl font-heading font-black tracking-tighter uppercase">{selectedOrder.status}</h3>
              </div>

              {/* Order Info Cards */}
              <div className="grid grid-cols-1 gap-4">
                <div className="glass p-6 rounded-3xl flex items-center gap-4">
                   <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40"><User size={20} /></div>
                   <div>
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Customer</p>
                      <p className="text-sm font-bold uppercase">{selectedOrder.customerName}</p>
                   </div>
                </div>
                <div className="glass p-6 rounded-3xl flex items-center gap-4">
                   <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40"><Package size={20} /></div>
                   <div>
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Product</p>
                      <p className="text-sm font-bold uppercase">{selectedOrder.productName}</p>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="glass p-6 rounded-3xl flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-white/40"><CreditCard size={18} /></div>
                      <div>
                         <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Total</p>
                         <p className="text-sm font-bold">${selectedOrder.amount}</p>
                      </div>
                   </div>
                   <div className="glass p-6 rounded-3xl flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-white/40"><Calendar size={18} /></div>
                      <div>
                         <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Date</p>
                         <p className="text-sm font-bold">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* Payment Proof Immersive View */}
              <div className="space-y-4 pt-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 px-2">Payment Receipt</h3>
                <div className="relative aspect-[9/16] w-full glass rounded-[3rem] overflow-hidden border border-white/5 group">
                  {selectedOrder.paymentScreenshot ? (
                    <Image 
                      src={selectedOrder.paymentScreenshot} 
                      alt="Payment" 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-10 opacity-20">
                      <Smartphone size={64} className="mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">No Proof Uploaded</p>
                    </div>
                  )}
                  {/* Subtle overlay for better visual integration */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                 <button 
                  onClick={() => handleStatusUpdate(selectedOrder._id, "Rejected")}
                  className="bg-red-500/10 text-red-500 font-black py-5 rounded-[2rem] border border-red-500/20 uppercase tracking-widest text-[10px] active:scale-95 transition-transform"
                >
                  Reject Drop
                </button>
                <button 
                  onClick={() => handleStatusUpdate(selectedOrder._id, "Verified")}
                  className="bg-accent text-black font-black py-5 rounded-[2rem] glow-accent uppercase tracking-widest text-[10px] active:scale-95 transition-transform"
                >
                  Verify Payment
                </button>
              </div>

              <button className="w-full glass py-5 rounded-[2rem] text-white font-black flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] active:scale-95 transition-transform">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white"><ExternalLink size={10} /></div>
                Open WhatsApp Chat
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AdminNavbar />
    </main>
  );
}

