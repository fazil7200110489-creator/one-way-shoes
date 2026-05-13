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
  LayoutDashboard,
  Package,
  Plus,
  CreditCard,
  LogOut,
  Loader2
} from "lucide-react";
import Link from "next/link";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

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
      case "Verified": return "text-green-400 bg-green-500/10";
      case "Rejected": return "text-red-400 bg-red-500/10";
      default: return "text-yellow-400 bg-yellow-500/10";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Verified": return <CheckCircle2 size={14} />;
      case "Rejected": return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white px-6 py-10 pb-32">
      <header className="mb-10">
        <h1 className="text-2xl font-heading font-black tracking-tighter uppercase">ORDERS</h1>
        <p className="text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase">VERIFY PAYMENTS</p>
      </header>

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="text-xs font-bold tracking-widest uppercase">Fetching Orders...</p>
          </div>
        ) : orders.map((order, idx) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setSelectedOrder(order)}
            className="glass p-5 rounded-[2rem] flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-white/40">{order._id.slice(-8)}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)} {order.status.toUpperCase()}
                </span>
              </div>
              <h3 className="font-heading font-bold text-sm uppercase">{order.customerName}</h3>
              <p className="text-xs text-white/60">{order.productName} • ${order.amount}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-[10px] text-white/20 font-bold">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
              <ChevronRight size={18} className="text-white/20" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Order Detail Modal / Payment Verification */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl px-6 py-10 flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-heading font-black tracking-tighter uppercase">ORDER DETAILS</h2>
              <button onClick={() => setSelectedOrder(null)} className="glass p-2 rounded-full">
                <XCircle size={24} />
              </button>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto pb-10">
              <div className="glass rounded-[2rem] p-6 space-y-4">
                <div className="flex justify-between border-b border-white/5 pb-4">
                  <span className="text-white/40 text-xs font-bold uppercase">Customer</span>
                  <span className="text-sm font-bold uppercase">{selectedOrder.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-4">
                  <span className="text-white/40 text-xs font-bold uppercase">Product</span>
                  <span className="text-sm font-bold uppercase">{selectedOrder.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 text-xs font-bold uppercase">Amount</span>
                  <span className="text-accent font-bold text-lg">${selectedOrder.amount}</span>
                </div>
              </div>

              {/* Payment Screenshot Verification */}
              <div className="space-y-4">
                <h3 className="text-xs font-black tracking-widest text-white/40 uppercase px-4">Payment Verification</h3>
                <div className="relative aspect-[9/16] w-full bg-white/5 rounded-[2.5rem] overflow-hidden flex items-center justify-center">
                  {selectedOrder.paymentScreenshot ? (
                    <Image src={selectedOrder.paymentScreenshot} alt="Payment" fill className="object-cover" />
                  ) : (
                    <div className="text-center p-10 opacity-30">
                      <Smartphone size={48} className="mx-auto mb-4" />
                      <p className="text-xs font-bold">NO SCREENSHOT UPLOADED</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button 
                  onClick={() => handleStatusUpdate(selectedOrder._id, "Rejected")}
                  className="bg-red-500/20 text-red-400 font-bold py-4 rounded-2xl border border-red-500/30"
                >
                  REJECT
                </button>
                <button 
                  onClick={() => handleStatusUpdate(selectedOrder._id, "Verified")}
                  className="bg-green-500/20 text-green-400 font-bold py-4 rounded-2xl border border-green-500/30"
                >
                  VERIFY
                </button>
              </div>

              <button className="w-full glass py-4 rounded-2xl text-accent font-bold flex items-center justify-center gap-2">
                CONTACT VIA WHATSAPP <ExternalLink size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Bottom Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[450px] glass-dark rounded-full px-8 py-4 z-50 flex justify-between items-center border border-white/10 shadow-2xl">
        <Link href="/admin/dashboard" className="text-white/40"><LayoutDashboard size={24} /></Link>
        <Link href="/admin/products" className="text-white/40"><Package size={24} /></Link>
        <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center -mt-12 border-4 border-[#050505] shadow-xl">
          <CreditCard size={24} className="text-black" />
        </div>
        <Link href="/admin/orders" className="text-accent"><CreditCard size={24} /></Link>
        <Link href="/" className="text-white/40"><LogOut size={24} /></Link>
      </div>
    </main>
  );
}

