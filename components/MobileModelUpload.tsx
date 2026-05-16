"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Plus, 
  Trash2, 
  Loader2, 
  Upload,
  ChevronLeft,
  Box,
  FileCode
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";

interface MobileModelUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MobileModelUpload({ value, onChange }: MobileModelUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const deleteFromStorage = async (url: string) => {
    try {
      const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "products";
      const urlParts = url.split(`/storage/v1/object/public/${bucket}/`);
      if (urlParts.length < 2) return;
      
      const filePath = urlParts[1];
      const { error } = await getSupabase().storage
        .from(bucket)
        .remove([filePath]);
        
      if (error) console.error("Error deleting from storage:", error);
    } catch (err) {
      console.error("Failed to parse URL for deletion:", err);
    }
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExt !== 'glb' && fileExt !== 'gltf') {
      alert("Only .glb and .gltf files are supported.");
      return;
    }

    setUploading(true);
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "products";

    try {
      // Create a unique file path
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `models/${fileName}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await getSupabase().storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: fileExt === 'glb' ? 'model/gltf-binary' : 'model/gltf+json'
        });

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data: { publicUrl } } = getSupabase().storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (publicUrl) {
        // If there was an old model, delete it
        if (value && value.includes("supabase.co")) {
          await deleteFromStorage(value);
        }
        onChange(publicUrl);
      }
    } catch (error: any) {
      console.error("Upload failed:", error);
      alert(`Upload Error: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const removeModel = async () => {
    if (!confirm("Are you sure you want to remove the 3D model?")) return;
    
    const urlToRemove = value;
    onChange("");

    if (urlToRemove && urlToRemove.includes("supabase.co")) {
      await deleteFromStorage(urlToRemove);
    }
  };

  return (
    <div className="w-full">
      {/* Mini Preview / Action Area */}
      <div className="space-y-4">
        {value ? (
          <div className="glass p-6 rounded-[2rem] border border-accent/20 flex items-center gap-5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
            <div className="p-4 bg-accent/10 rounded-2xl text-accent">
              <Box size={32} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">3D Model Active</p>
              <p className="text-[9px] font-bold text-white/40 truncate mt-0.5">{value.split('/').pop()}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-white/5 text-white/60 rounded-xl hover:bg-white/10 transition-colors"
              >
                <Plus size={18} />
              </button>
              <button 
                onClick={removeModel}
                className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ) : (
          <button 
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="w-full py-10 glass rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 hover:border-accent/50 hover:bg-accent/5 transition-all group"
          >
            <div className="p-4 bg-white/5 rounded-2xl text-white/20 group-hover:text-accent group-hover:bg-accent/10 transition-all">
              <Box size={32} />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-accent transition-colors">Add 3D Model</p>
              <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest mt-1">GLB or GLTF Formats Supported</p>
            </div>
          </button>
        )}
      </div>

      {/* Fullscreen Upload UI */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-[#050505] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-xl">
              <button onClick={() => setIsFullscreen(false)} className="p-2 -ml-2 text-white/60">
                <ChevronLeft size={24} />
              </button>
              <h2 className="text-sm font-heading font-black tracking-[0.2em] uppercase">3D Assets</h2>
              <div className="w-10" /> 
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-10">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto text-accent">
                  <Box size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-heading font-black tracking-tighter uppercase">Upload 3D Shoe Model</h3>
                  <p className="text-xs text-white/40 leading-relaxed max-w-[250px] mx-auto uppercase tracking-wide font-bold">
                    Provide a high-fidelity GLB or GLTF model for an immersive product experience.
                  </p>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full glass p-12 rounded-[3rem] border-accent/20 hover:border-accent transition-all relative overflow-hidden group flex flex-col items-center gap-6"
              >
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                {uploading ? (
                  <>
                    <Loader2 size={48} className="animate-spin text-accent" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent animate-pulse">Uploading Model...</p>
                  </>
                ) : (
                  <>
                    <div className="p-6 bg-accent/10 rounded-3xl text-accent">
                      <Upload size={40} />
                    </div>
                    <div className="text-center">
                      <p className="text-[11px] font-black uppercase tracking-[0.3em]">Select File</p>
                      <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">From Device Storage</p>
                    </div>
                  </>
                )}
              </button>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass p-5 rounded-2xl border-white/5 space-y-2">
                  <FileCode size={16} className="text-white/40" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/60">Optimized</p>
                  <p className="text-[8px] font-bold text-white/20 uppercase">Under 10MB Recommended</p>
                </div>
                <div className="glass p-5 rounded-2xl border-white/5 space-y-2">
                  <Upload size={16} className="text-white/40" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/60">Format</p>
                  <p className="text-[8px] font-bold text-white/20 uppercase">GLB / GLTF Only</p>
                </div>
              </div>

              {/* Hidden Input */}
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".glb,.gltf" 
                onChange={(e) => {
                  handleUpload(e.target.files);
                  if (e.target.files && e.target.files.length > 0) {
                    setIsFullscreen(false);
                  }
                }}
                className="hidden"
              />
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-black/50 backdrop-blur-xl">
              <button 
                onClick={() => setIsFullscreen(false)}
                className="w-full bg-white text-black font-heading font-black py-5 rounded-[2rem] glow-white uppercase tracking-[0.1em]"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
