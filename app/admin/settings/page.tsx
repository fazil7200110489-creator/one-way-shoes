"use client";

import { motion } from "framer-motion";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Smartphone, 
  Globe, 
  LogOut,
  ChevronRight,
  Database,
  Cloud
} from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";

export default function SettingsPage() {
  const sections = [
    {
      title: "Account",
      items: [
        { label: "Profile Details", icon: <User size={18} />, color: "text-blue-400" },
        { label: "Security & Passwords", icon: <Shield size={18} />, color: "text-green-400" },
      ]
    },
    {
      title: "System",
      items: [
        { label: "Notifications", icon: <Bell size={18} />, color: "text-yellow-400" },
        { label: "Mobile Experience", icon: <Smartphone size={18} />, color: "text-purple-400" },
        { label: "Regional Settings", icon: <Globe size={18} />, color: "text-accent" },
      ]
    },
    {
      title: "Infrastructure",
      items: [
        { label: "Database Status", icon: <Database size={18} />, color: "text-white/40" },
        { label: "Supabase Storage", icon: <Cloud size={18} />, color: "text-white/40" },
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white pb-40">
      <div className="absolute inset-0 bg-grain opacity-5 pointer-events-none" />

      <div className="sticky top-0 z-50 glass-dark border-b border-white/5 px-6 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-heading font-black tracking-tighter uppercase leading-none">Settings</h1>
          <p className="text-[8px] font-bold text-white/40 uppercase tracking-[0.4em] mt-1">System Control</p>
        </div>
        <div className="glass p-3 rounded-xl text-white/40"><Settings size={18} /></div>
      </div>

      <div className="px-6 py-8 space-y-10">
        {sections.map((section, idx) => (
          <section key={section.title} className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-4">{section.title}</h2>
            <div className="glass rounded-[2.5rem] overflow-hidden divide-y divide-white/5">
              {section.items.map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (idx * section.items.length + i) * 0.05 }}
                  className="w-full flex items-center justify-between p-6 hover:bg-white/[0.02] active:bg-white/[0.05] transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`${item.color} opacity-60 group-hover:opacity-100 transition-opacity`}>
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold uppercase tracking-tight">{item.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-white/20 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </motion.button>
              ))}
            </div>
          </section>
        ))}

        <button 
          onClick={() => {
            document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            window.location.href = "/admin/login";
          }}
          className="w-full glass p-6 rounded-[2.5rem] flex items-center justify-between group hover:bg-red-500/5 transition-colors border border-red-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-red-500">
              <LogOut size={18} />
            </div>
            <span className="text-sm font-black uppercase tracking-widest text-red-500">System Logout</span>
          </div>
          <ChevronRight size={16} className="text-red-500/20" />
        </button>

        <div className="text-center pt-4">
          <p className="text-[8px] font-black uppercase tracking-[0.6em] text-white/10">ONE WAY SHOES CORE V2.0.4</p>
        </div>
      </div>

      <AdminNavbar />
    </main>
  );
}
