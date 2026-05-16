"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  X, 
  Camera, 
  Save, 
  Loader2, 
  Package,
  ChevronRight,
  MoreVertical,
  Image as ImageIcon
} from "lucide-react";
import Image from "next/image";
import AdminNavbar from "@/components/AdminNavbar";
import MobileImageUpload from "@/components/MobileImageUpload";
import MobileModelUpload from "@/components/MobileModelUpload";
import { getSupabase } from "@/lib/supabase";

export default function AdminProducts() {
  const [productList, setProductList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const initialForm = {
    name: "",
    price: "",
    stock: "",
    description: "",
    images: [] as string[],
    rotationImages: [] as string[],
    model3DUrl: "",
    isLimitedEdition: false
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProductList(data);
      } else {
        setProductList([]);
      }
    } catch (err) {
      console.error(err);
      setProductList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || "",
      images: product.images || [],
      rotationImages: product.rotationImages || [],
      model3DUrl: product.model3DUrl || "",
      isLimitedEdition: product.isLimitedEdition || false
    });
    setEditingId(product._id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setIsAdding(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          sizes: [7, 8, 9, 10, 11],
          colors: ["#000000", "#ffffff"],
          featured: true, // Default to true so it shows up on homepage
          trending: true, // Default to true so it shows up on homepage
          isLimitedEdition: formData.isLimitedEdition
        })
      });
      if (res.ok) {
        alert("Product saved successfully!");
        resetForm();
        fetchProducts();
      } else {
        const errorData = await res.json();
        alert(`Failed to save product: ${errorData.error || res.statusText}\n${errorData.details || ''}`);
      }
    } catch (err) {
      console.error(err);
      alert(`Network error: Could not connect to the database. Make sure your IP is whitelisted on MongoDB Atlas.`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (shoe: any) => {
    if (!confirm(`Are you sure you want to delete ${shoe.name}?`)) return;
    try {
      const supabase = getSupabase();
      if (shoe.images && Array.isArray(shoe.images)) {
        for (const url of shoe.images) {
          if (url.includes("supabase.co")) {
            try {
              const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "products";
              const urlParts = url.split(`/storage/v1/object/public/${bucket}/`);
              if (urlParts.length >= 2) {
                const filePath = urlParts[1];
                await supabase.storage.from(bucket).remove([filePath]);
              }
            } catch (err) {
              console.error("Failed to delete image from storage:", err);
            }
          }
        }
      }
      if (shoe.model3DUrl && shoe.model3DUrl.includes("supabase.co")) {
        try {
          const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "products";
          const urlParts = shoe.model3DUrl.split(`/storage/v1/object/public/${bucket}/`);
          if (urlParts.length >= 2) {
            const filePath = urlParts[1];
            await supabase.storage.from(bucket).remove([filePath]);
          }
        } catch (err) {
          console.error("Failed to delete model from storage:", err);
        }
      }
      await fetch(`/api/products/${shoe._id}`, { method: "DELETE" });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = productList.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-black text-white pb-40">
      <div className="absolute inset-0 bg-grain opacity-5 pointer-events-none" />

      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-50 glass-dark border-b border-white/5 px-6 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-heading font-black tracking-tighter uppercase leading-none">Catalog</h1>
          <p className="text-[8px] font-bold text-white/40 uppercase tracking-[0.4em] mt-1">Manage Inventory</p>
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
            placeholder="Search catalog..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-5 pl-16 pr-6 outline-none focus:border-accent/30 transition-all font-medium text-sm"
          />
        </div>

        {/* Product Grid - Mobile Optimized Cards */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="text-xs font-black tracking-widest uppercase">Syncing Database...</p>
            </div>
          ) : filteredProducts.length > 0 ? filteredProducts.map((shoe, idx) => (
            <motion.div
              key={shoe._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass p-4 rounded-[2.5rem] flex items-center gap-5 group active:bg-white/[0.03] transition-all relative overflow-hidden"
            >
              <div className="relative w-24 h-24 bg-white/[0.02] rounded-[1.8rem] overflow-hidden flex-shrink-0 border border-white/5">
                <Image 
                  src={shoe.images?.[0] || "/images/hero_sneaker.png"} 
                  alt={shoe.name} 
                  fill 
                  className="object-cover p-2" 
                />
              </div>
              
              <div className="flex-1 overflow-hidden">
                <h3 className="font-heading font-black text-sm truncate uppercase tracking-tight mb-1">{shoe.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-accent text-xs font-black">₹{shoe.price}</span>
                  <span className="w-1 h-1 bg-white/10 rounded-full" />
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${shoe.stock < 10 ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                    Stock: {shoe.stock}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(shoe)}
                    className="bg-white/5 hover:bg-white/10 text-white/60 p-2 rounded-xl transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleEdit(shoe)} // Reuse edit to show photos update
                    className="bg-white/5 hover:bg-white/10 text-white/60 p-2 rounded-xl transition-colors"
                  >
                    <ImageIcon size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(shoe)}
                    className="bg-red-500/5 hover:bg-red-500/10 text-red-400/60 p-2 rounded-xl transition-colors ml-auto"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="py-24 glass rounded-[3rem] text-center space-y-4 opacity-20 border-dashed border-white/10">
                <Package size={48} className="mx-auto" />
                <p className="text-xs font-black uppercase tracking-[0.2em]">Inventory Empty</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Product Immersive Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-black flex flex-col"
          >
            <div className="sticky top-0 z-[210] glass-dark border-b border-white/5 px-6 py-6 flex justify-between items-center">
              <button onClick={resetForm} className="glass p-3 rounded-2xl text-white/40"><X size={20} /></button>
              <h2 className="text-sm font-heading font-black tracking-widest uppercase">
                {editingId ? "Edit Sneaker" : "New Sneaker"}
              </h2>
              <button 
                onClick={(e) => handleSave(e as any)}
                disabled={isSaving}
                className="bg-accent text-black p-3 rounded-2xl glow-accent disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 pb-20">
              {/* Main Gallery */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Main Gallery</h3>
                  <span className="text-[8px] font-bold text-accent uppercase">{formData.images.length} Images</span>
                </div>
                <MobileImageUpload 
                  value={formData.images}
                  onChange={(images) => setFormData({ ...formData, images })}
                />
              </div>

              {/* 360° Rotation Set */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">360° Rotation Set</h3>
                  <span className="text-[8px] font-bold text-accent uppercase">{formData.rotationImages.length} Frames</span>
                </div>
                <p className="text-[8px] text-white/30 uppercase tracking-[0.2em] px-2 -mt-2">Upload images in sequence for smooth rotation</p>
                <MobileImageUpload 
                  value={formData.rotationImages}
                  onChange={(rotationImages) => setFormData({ ...formData, rotationImages })}
                />
              </div>

              {/* 3D Model Asset */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00f2ff]">Real 3D Asset (GLB/GLTF)</h3>
                  <span className="text-[8px] font-bold text-accent uppercase">{formData.model3DUrl ? "Active" : "None"}</span>
                </div>
                <p className="text-[8px] text-white/30 uppercase tracking-[0.2em] px-2 -mt-2">Provide a true interactive 3D model for this product</p>
                <MobileModelUpload 
                  value={formData.model3DUrl}
                  onChange={(model3DUrl) => setFormData({ ...formData, model3DUrl })}
                />
              </div>

              {/* Status Toggles */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Product Status</h3>
                </div>
                <div className="glass p-5 rounded-[2rem] border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-tight">Limited Edition</p>
                    <p className="text-[8px] text-white/30 uppercase tracking-widest mt-0.5">Show in exclusive drops section</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, isLimitedEdition: !formData.isLimitedEdition })}
                    className={`w-14 h-8 rounded-full transition-all duration-500 relative ${formData.isLimitedEdition ? 'bg-accent' : 'bg-white/10'}`}
                  >
                    <motion.div 
                      animate={{ x: formData.isLimitedEdition ? 24 : 4 }}
                      className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg`}
                    />
                  </button>
                </div>
              </div>

              {/* Core Details */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] ml-4">Product Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. CYBER CORE X1"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-accent/30 transition-all font-bold uppercase tracking-tight" 
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] ml-4">Price (₹)</label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-accent/30 transition-all font-bold" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] ml-4">Stock</label>
                    <input 
                      type="number" 
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-accent/30 transition-all font-bold" 
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] ml-4">Manifesto / Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the aesthetic and performance..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-accent/30 transition-all h-40 resize-none" 
                  />
                </div>
              </div>

              <button 
                onClick={(e) => handleSave(e as any)}
                disabled={isSaving}
                className="w-full bg-white text-black font-heading font-black py-6 rounded-[2rem] glow-soft flex items-center justify-center gap-3 disabled:opacity-50 uppercase tracking-widest text-xs"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {isSaving ? "Syncing..." : "Publish Product"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={() => { resetForm(); setIsAdding(true); }}
        className="fixed bottom-28 right-8 w-16 h-16 bg-accent rounded-2xl flex items-center justify-center z-[90] shadow-[0_20px_40px_rgba(0,242,255,0.3)] active:scale-90 transition-transform group"
      >
        <Plus size={28} className="text-black group-hover:rotate-90 transition-transform duration-500" />
      </motion.button>

      <AdminNavbar />
    </main>
  );
}


