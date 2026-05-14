"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Target,
  Zap,
  Globe,
  PieChart
} from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";

export default function AnalyticsPage() {
  const data = [
    { label: "Conversion", value: "3.2%", trend: "+0.4%", icon: <Zap size={18} />, color: "bg-yellow-400/10 text-yellow-400" },
    { label: "Reach", value: "12.4k", trend: "+18%", icon: <Globe size={18} />, color: "bg-blue-400/10 text-blue-400" },
    { label: "Orders", value: "842", trend: "-2%", icon: <Target size={18} />, color: "bg-red-400/10 text-red-400" },
  ];

  return (
    <main className="min-h-screen bg-black text-white pb-40">
      <div className="absolute inset-0 bg-grain opacity-5 pointer-events-none" />

      <div className="sticky top-0 z-50 glass-dark border-b border-white/5 px-6 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-heading font-black tracking-tighter uppercase leading-none">Intelligence</h1>
          <p className="text-[8px] font-bold text-white/40 uppercase tracking-[0.4em] mt-1">Growth Metrics</p>
        </div>
        <div className="glass p-3 rounded-xl text-white/40"><BarChart3 size={18} /></div>
      </div>

      <div className="px-6 py-8 space-y-10">
        {/* Performance Cards */}
        <section className="grid grid-cols-1 gap-4">
          {data.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-[2.5rem] flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{item.label}</p>
                  <p className="text-xl font-heading font-black">{item.value}</p>
                </div>
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter ${item.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {item.trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {item.trend}
              </div>
            </motion.div>
          ))}
        </section>

        {/* Chart Placeholder */}
        <section className="space-y-4">
           <h2 className="text-sm font-black uppercase tracking-[0.3em] px-2">Revenue Velocity</h2>
           <div className="glass aspect-video rounded-[3rem] p-8 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
              <div className="relative z-10 flex justify-between items-start">
                 <div>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Monthly Target</p>
                    <p className="text-3xl font-heading font-black text-accent">$45,000</p>
                 </div>
                 <div className="glass p-3 rounded-xl text-white/60"><PieChart size={20} /></div>
              </div>
              
              <div className="relative z-10 flex items-end gap-1 h-24">
                 {[...Array(12)].map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.random() * 80 + 20}%` }}
                      transition={{ delay: i * 0.05, duration: 1 }}
                      className="flex-1 bg-white/5 rounded-t-lg group-hover:bg-accent/20 transition-colors"
                    />
                 ))}
              </div>
           </div>
        </section>
      </div>

      <AdminNavbar />
    </main>
  );
}
