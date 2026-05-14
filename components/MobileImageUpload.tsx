"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  Image as ImageIcon, 
  X, 
  Plus, 
  Trash2, 
  Loader2, 
  Upload,
  ChevronLeft,
  Maximize2
} from "lucide-react";
import Image from "next/image";
import { getSupabase } from "@/lib/supabase";

// ... (rest of file unchanged until line where supabase is used)
// replace supabase.storage calls with getSupabase().storage

const compressImage = (file: File): Promise<File | Blob> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          } else {
            resolve(file);
          }
        }, "image/jpeg", 0.8);
      };
    };
  });
};

interface MobileImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function MobileImageUpload({ value, onChange }: MobileImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);

  const deleteFromStorage = async (url: string) => {
    try {
      const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "products";
      // Extract path from public URL
      // Example URL: https://xyz.supabase.co/storage/v1/object/public/products/123-abc.jpg
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

    setUploading(true);
    const newImages = [...value];
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "products";

    try {
      for (let i = 0; i < files.length; i++) {
        const originalFile = files[i];
        
        // Compress image before upload
        const file = await compressImage(originalFile);
        
        // Create a unique file path
        const fileExt = originalFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = fileName; // Upload directly to bucket root or specify folder

        // Upload to Supabase Storage
        const { data, error: uploadError } = await getSupabase().storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: originalFile.type
          });

        if (uploadError) throw uploadError;

        // Get Public URL
        const { data: { publicUrl } } = getSupabase().storage
          .from(bucket)
          .getPublicUrl(filePath);

        if (publicUrl) {
          newImages.push(publicUrl);
        }
      }
      onChange(newImages);
    } catch (error: any) {
      console.error("Upload failed:", error);
      alert(`Upload Error: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
      setReplacingIndex(null);
    }
  };

  const handleReplace = async (files: FileList | null) => {
    if (!files || files.length === 0 || replacingIndex === null) return;

    const oldUrl = value[replacingIndex];
    setUploading(true);
    const newImages = [...value];
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "products";

    try {
      const originalFile = files[0];
      const file = await compressImage(originalFile);

      const fileExt = originalFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await getSupabase().storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: originalFile.type
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = getSupabase().storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (publicUrl) {
        newImages[replacingIndex] = publicUrl;
        onChange(newImages);
        
        // Delete old image from storage
        if (oldUrl && oldUrl.includes("supabase.co")) {
          await deleteFromStorage(oldUrl);
        }
      }
    } catch (error: any) {
      console.error("Replace failed:", error);
      alert(`Replace Error: ${error.message}`);
    } finally {
      setUploading(false);
      setReplacingIndex(null);
    }
  };

  const removeImage = async (index: number) => {
    const urlToRemove = value[index];
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);

    // Optional: Delete from storage immediately
    // For production, you might want to confirm first or only delete on Save
    if (urlToRemove && urlToRemove.includes("supabase.co")) {
      await deleteFromStorage(urlToRemove);
    }
  };

  const moveImage = (from: number, to: number) => {
    const newImages = [...value];
    const [removed] = newImages.splice(from, 1);
    newImages.splice(to, 0, removed);
    onChange(newImages);
  };

  return (
    <div className="w-full">
      {/* Mini Preview Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {value.map((url, idx) => (
          <motion.div 
            key={url + idx}
            layoutId={url}
            className="relative aspect-square rounded-2xl overflow-hidden glass border border-white/10 group"
          >
            <Image 
              src={url} 
              alt={`Product ${idx}`} 
              fill 
              className="object-cover"
            />
            <button 
              onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
              className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-md rounded-full text-white/80 hover:text-red-400 transition-colors"
            >
              <X size={14} />
            </button>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <span className="text-[10px] font-black uppercase tracking-widest">#{idx + 1}</span>
            </div>
          </motion.div>
        ))}
        
        {value.length < 6 && (
          <button 
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:border-accent/50 hover:bg-accent/5 transition-all group"
          >
            <Plus size={24} className="text-white/20 group-hover:text-accent transition-colors" />
            <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest group-hover:text-accent transition-colors">Add</span>
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
              <h2 className="text-sm font-heading font-black tracking-[0.2em] uppercase">Product Gallery</h2>
              <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Main Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="glass p-8 rounded-[2.5rem] flex flex-col items-center gap-4 border-accent/20 hover:border-accent transition-colors relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="p-4 bg-accent/10 rounded-2xl text-accent">
                    <Camera size={32} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Open Camera</span>
                </button>

                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="glass p-8 rounded-[2.5rem] flex flex-col items-center gap-4 border-white/10 hover:border-white/20 transition-colors relative overflow-hidden group"
                >
                  <div className="p-4 bg-white/5 rounded-2xl text-white/60">
                    <ImageIcon size={32} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">From Gallery</span>
                </button>
              </div>

              {/* Hidden Inputs */}
              <input 
                ref={cameraInputRef}
                type="file" 
                accept="image/*" 
                capture="environment" 
                onChange={(e) => handleUpload(e.target.files)}
                className="hidden"
              />
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                multiple 
                onChange={(e) => handleUpload(e.target.files)}
                className="hidden"
              />
              <input 
                ref={replaceInputRef}
                type="file" 
                accept="image/*" 
                onChange={(e) => handleReplace(e.target.files)}
                className="hidden"
              />

              {/* Upload Status */}
                  {uploading && (
                <div className="flex flex-col items-center gap-4 py-10 glass rounded-[2.5rem] border-accent/20">
                  <Loader2 size={40} className="animate-spin text-accent" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent animate-pulse">Uploading to Supabase...</p>
                </div>
              )}

              {/* Sortable/Manageable List */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Manage Images ({value.length}/6)</span>
                  {value.length > 0 && (
                     <span className="text-[10px] font-bold text-accent uppercase">Drag to reorder</span>
                  )}
                </div>
                
                <div className="space-y-3">
                  {value.map((url, idx) => (
                    <motion.div 
                      key={url}
                      layout
                      className="glass p-3 rounded-2xl flex items-center gap-4 border-white/5"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                        <Image src={url} alt="" fill className="object-cover" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-[10px] font-bold text-white/40 truncate">{url.split('/').pop()}</p>
                        <p className="text-[10px] font-black text-accent uppercase">Position #{idx + 1}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setReplacingIndex(idx);
                            replaceInputRef.current?.click();
                          }}
                          className="p-3 bg-white/5 text-white/60 rounded-xl hover:bg-white/10 transition-colors"
                        >
                          <ImageIcon size={18} />
                        </button>
                        <button 
                          onClick={() => removeImage(idx)}
                          className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  
                  {value.length === 0 && !uploading && (
                    <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4">
                      <Upload size={48} />
                      <p className="text-xs font-black uppercase tracking-[0.2em]">No images uploaded yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-black/50 backdrop-blur-xl">
              <button 
                onClick={() => setIsFullscreen(false)}
                className="w-full bg-white text-black font-heading font-black py-5 rounded-[2rem] glow-white uppercase tracking-[0.1em]"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
