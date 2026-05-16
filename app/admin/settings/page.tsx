"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Cloud,
  X,
  Save,
  Loader2,
  Camera,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import Image from "next/image";
import AdminNavbar from "@/components/AdminNavbar";
import MobileImageUpload from "@/components/MobileImageUpload";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [refreshingHealth, setRefreshingHealth] = useState(false);

  // Password fields
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchHealth();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHealth = async () => {
    setRefreshingHealth(true);
    try {
      const res = await fetch("/api/admin/health");
      const data = await res.json();
      setHealthStatus(data);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshingHealth(false);
    }
  };

  const handleUpdateSettings = async (newData: any) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData)
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
        // Optional: toast success
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
       alert("Passwords do not match");
       return;
    }
    // Real logic would verify current password on backend
    handleUpdateSettings({ security: { password: passwords.new } });
    setPasswords({ current: "", new: "", confirm: "" });
    setActiveModal(null);
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
          <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-accent animate-pulse">Initializing System</p>
      </div>
    );
  }

  const sections = [
    {
      title: "Account",
      items: [
        { id: "profile", label: "Profile Details", icon: <User size={18} />, color: "text-blue-400" },
        { id: "security", label: "Security & Passwords", icon: <Shield size={18} />, color: "text-green-400" },
      ]
    },
    {
      title: "System",
      items: [
        { id: "notifications", label: "Notifications", icon: <Bell size={18} />, color: "text-yellow-400" },
        { id: "mobile", label: "Mobile Experience", icon: <Smartphone size={18} />, color: "text-purple-400" },
        { id: "regional", label: "Regional Settings", icon: <Globe size={18} />, color: "text-accent" },
      ]
    },
    {
      title: "Infrastructure",
      items: [
        { id: "database", label: "Database Status", icon: <Database size={18} />, color: "text-white/40" },
        { id: "storage", label: "Supabase Storage", icon: <Cloud size={18} />, color: "text-white/40" },
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white pb-40">
      <div className="absolute inset-0 bg-grain opacity-5 pointer-events-none" />

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 glass-dark border-b border-white/5 px-6 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-heading font-black tracking-tighter uppercase leading-none">Settings</h1>
          <p className="text-[8px] font-bold text-white/40 uppercase tracking-[0.4em] mt-1">System Control</p>
        </div>
        <div className="glass p-3 rounded-xl text-white/40"><Settings size={18} /></div>
      </div>

      <div className="px-6 py-8 space-y-10">
        {/* Profile Quick Glance */}
        <section className="glass p-6 rounded-[2.5rem] flex items-center gap-5 border border-white/5">
           <div className="relative w-20 h-20 rounded-3xl overflow-hidden border border-white/10">
              <Image src={settings.profile.storeLogo} alt="Logo" fill className="object-cover" />
           </div>
           <div>
              <h2 className="text-lg font-heading font-black uppercase tracking-tight">{settings.profile.storeName}</h2>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{settings.profile.email}</p>
              <div className="mt-2 flex gap-2">
                 <span className="text-[8px] font-black bg-accent/10 text-accent px-2 py-0.5 rounded-full uppercase">Enterprise</span>
                 <span className="text-[8px] font-black bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full uppercase">Active</span>
              </div>
           </div>
        </section>

        {sections.map((section, idx) => (
          <section key={section.title} className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-4">{section.title}</h2>
            <div className="glass rounded-[2.5rem] overflow-hidden divide-y divide-white/5">
              {section.items.map((item, i) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveModal(item.id)}
                  className="w-full flex items-center justify-between p-6 hover:bg-white/[0.02] active:bg-white/[0.05] transition-colors group text-left"
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
      </div>

      {/* Dynamic Modals */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className="fixed inset-0 z-[200] bg-black flex flex-col"
          >
            <div className="sticky top-0 z-[210] glass-dark border-b border-white/5 px-6 py-6 flex justify-between items-center">
              <button onClick={() => setActiveModal(null)} className="glass p-3 rounded-2xl text-white/40"><X size={20} /></button>
              <h2 className="text-sm font-heading font-black tracking-widest uppercase">{activeModal.replace('-', ' ')}</h2>
              <div className="w-12" />
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 pb-32">
              {/* Profile Details Modal Content */}
              {activeModal === "profile" && (
                <div className="space-y-8">
                   <div className="flex flex-col items-center gap-4">
                      <div className="relative w-32 h-32 rounded-[2.5rem] overflow-hidden border border-white/10 group">
                        <Image src={settings.profile.storeLogo} alt="Logo" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                           <Camera size={24} />
                        </div>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-accent">Update Store Logo</p>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] ml-4">Admin Name</label>
                        <input 
                          type="text" 
                          value={settings.profile.name}
                          onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, name: e.target.value } })}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-accent/30 transition-all font-bold" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] ml-4">Admin Email</label>
                        <input 
                          type="email" 
                          value={settings.profile.email}
                          onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, email: e.target.value } })}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-accent/30 transition-all font-bold" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] ml-4">Store Name</label>
                        <input 
                          type="text" 
                          value={settings.profile.storeName}
                          onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, storeName: e.target.value } })}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-accent/30 transition-all font-bold" 
                        />
                      </div>
                   </div>
                   
                   <button 
                     onClick={() => handleUpdateSettings(settings)}
                     className="w-full bg-white text-black font-black py-6 rounded-[2rem] flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                   >
                     {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                     Save Changes
                   </button>
                </div>
              )}

              {/* Notifications Modal Content */}
              {activeModal === "notifications" && (
                <div className="space-y-4">
                   {Object.keys(settings.notifications).map((key) => (
                     <div key={key} className="glass p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold uppercase tracking-tight">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
                          <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">Enabled for all system events</p>
                        </div>
                        <button 
                          onClick={() => {
                            const updated = { ...settings, notifications: { ...settings.notifications, [key]: !settings.notifications[key] } };
                            setSettings(updated);
                            handleUpdateSettings(updated);
                          }}
                          className={`w-14 h-8 rounded-full transition-all relative ${settings.notifications[key] ? 'bg-accent' : 'bg-white/10'}`}
                        >
                          <motion.div 
                            animate={{ x: settings.notifications[key] ? 24 : 4 }}
                            className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
                          />
                        </button>
                     </div>
                   ))}
                </div>
              )}

              {/* Security Modal */}
              {activeModal === "security" && (
                <div className="space-y-8">
                   <div className="glass p-8 rounded-[3rem] border border-white/5 text-center space-y-4">
                      <div className="w-16 h-16 bg-accent/10 text-accent rounded-3xl flex items-center justify-center mx-auto">
                         <Lock size={32} />
                      </div>
                      <div>
                        <h3 className="text-lg font-heading font-black uppercase">Auth Firewall</h3>
                        <p className="text-[10px] text-white/20 uppercase tracking-widest">Update your system access</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] ml-4">Current Password</label>
                        <div className="relative">
                          <input 
                            type={showPass ? "text" : "password"} 
                            value={passwords.current}
                            onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 pr-14 outline-none focus:border-accent/30 transition-all font-bold" 
                          />
                          <button onClick={() => setShowPass(!showPass)} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20">
                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] ml-4">New Secret Code</label>
                        <input 
                          type="password" 
                          value={passwords.new}
                          onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-accent/30 transition-all font-bold" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] ml-4">Confirm Code</label>
                        <input 
                          type="password" 
                          value={passwords.confirm}
                          onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-accent/30 transition-all font-bold" 
                        />
                      </div>
                   </div>

                   <button 
                     onClick={handleChangePassword}
                     className="w-full bg-accent text-black font-black py-6 rounded-[2rem] flex items-center justify-center gap-3 uppercase tracking-widest text-xs glow-accent"
                   >
                     Update Security Key
                   </button>
                </div>
              )}

              {/* Database Status Modal */}
              {activeModal === "database" && healthStatus && (
                <div className="space-y-8">
                   <div className="grid grid-cols-1 gap-4">
                      {[
                        { label: "MongoDB Atlas", status: healthStatus.mongodb.connected, details: healthStatus.mongodb.latency },
                        { label: "Supabase Storage", status: healthStatus.supabase.connected, details: healthStatus.supabase.storageUsage },
                        { label: "Internal API", status: healthStatus.api.status === "Operational", details: "Healthy" }
                      ].map((item) => (
                        <div key={item.label} className="glass p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className={`w-3 h-3 rounded-full ${item.status ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                              <div>
                                <p className="text-sm font-bold uppercase tracking-tight">{item.label}</p>
                                <p className="text-[9px] text-white/20 uppercase tracking-widest">Latency: {item.details}</p>
                              </div>
                           </div>
                           {item.status ? <CheckCircle2 className="text-green-500" size={20} /> : <AlertCircle className="text-red-500" size={20} />}
                        </div>
                      ))}
                   </div>

                   <div className="glass p-8 rounded-[3rem] border border-white/5 text-center space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Last System Sync</p>
                      <p className="text-xs font-bold text-accent uppercase tracking-widest">
                        {new Date(healthStatus.api.lastSync).toLocaleString()}
                      </p>
                   </div>

                   <button 
                     onClick={fetchHealth}
                     disabled={refreshingHealth}
                     className="w-full glass py-6 rounded-[2rem] flex items-center justify-center gap-3 uppercase tracking-widest text-xs font-black active:scale-95 transition-all"
                   >
                     {refreshingHealth ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                     Reconnect Check
                   </button>
                </div>
              )}

              {/* Mobile Experience Modal */}
              {activeModal === "mobile" && (
                <div className="space-y-4">
                   {Object.keys(settings.mobileExperience).map((key) => (
                     <div key={key} className="glass p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold uppercase tracking-tight">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
                          <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">Optimized for iPhone & Android</p>
                        </div>
                        <button 
                          onClick={() => {
                            const updated = { ...settings, mobileExperience: { ...settings.mobileExperience, [key]: !settings.mobileExperience[key] } };
                            setSettings(updated);
                            handleUpdateSettings(updated);
                          }}
                          className={`w-14 h-8 rounded-full transition-all relative ${settings.mobileExperience[key] ? 'bg-accent' : 'bg-white/10'}`}
                        >
                          <motion.div 
                            animate={{ x: settings.mobileExperience[key] ? 24 : 4 }}
                            className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
                          />
                        </button>
                     </div>
                   ))}
                </div>
              )}

              {/* Regional Settings Modal */}
              {activeModal === "regional" && (
                <div className="space-y-6">
                   <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] ml-4">Currency</label>
                        <select 
                          value={settings.regional.currency}
                          onChange={(e) => setSettings({ ...settings, regional: { ...settings.regional, currency: e.target.value } })}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-accent/30 transition-all font-bold uppercase"
                        >
                           <option value="INR">Indian Rupee (₹)</option>
                           <option value="USD">US Dollar ($)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] ml-4">Timezone</label>
                        <select 
                          value={settings.regional.timezone}
                          onChange={(e) => setSettings({ ...settings, regional: { ...settings.regional, timezone: e.target.value } })}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-accent/30 transition-all font-bold uppercase"
                        >
                           <option value="Asia/Kolkata">India (IST)</option>
                           <option value="UTC">Universal Coordinated (UTC)</option>
                        </select>
                      </div>
                   </div>

                   <button 
                     onClick={() => handleUpdateSettings(settings)}
                     className="w-full bg-white text-black font-black py-6 rounded-[2rem] flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                   >
                     Apply Regional Rules
                   </button>
                </div>
              )}

              {/* Supabase Storage Modal */}
              {activeModal === "storage" && healthStatus && (
                <div className="space-y-8">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col items-center gap-2">
                         <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Images</span>
                         <span className="text-3xl font-heading font-black text-accent">{healthStatus.supabase.imageCount}</span>
                      </div>
                      <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col items-center gap-2">
                         <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">3D Models</span>
                         <span className="text-3xl font-heading font-black text-purple-400">{healthStatus.supabase.modelCount}</span>
                      </div>
                   </div>

                   <div className="glass p-8 rounded-[3rem] border border-white/5 space-y-6">
                      <div className="flex justify-between items-center">
                         <p className="text-[10px] font-black uppercase tracking-widest">Storage Status</p>
                         <span className="text-xs font-bold">{healthStatus.supabase.storageUsage} Used</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                         <div className="w-1/3 h-full bg-accent animate-pulse-soft" />
                      </div>
                   </div>

                   <button className="w-full glass py-6 rounded-[2rem] flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] font-black border-dashed border-white/20 opacity-40">
                      Optimize Assets
                   </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AdminNavbar />
    </main>
  );
}
