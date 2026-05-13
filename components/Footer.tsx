"use client";

import { Instagram, MessageCircle, Twitter, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="pt-20 pb-10 px-6 bg-black border-t border-white/5">
      <div className="grid grid-cols-2 gap-10 mb-16">
        <div>
          <h4 className="text-white font-heading font-black tracking-tighter text-2xl mb-6">ONE WAY</h4>
          <div className="flex gap-4">
            <a href="#" className="glass p-3 rounded-full hover:bg-white/10 transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="glass p-3 rounded-full hover:bg-white/10 transition-colors">
              <MessageCircle size={20} />
            </a>
            <a href="#" className="glass p-3 rounded-full hover:bg-white/10 transition-colors">
              <Twitter size={20} />
            </a>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <h5 className="text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase">Links</h5>
          <a href="#" className="text-sm font-medium flex items-center justify-between">SHOP <ArrowUpRight size={14} /></a>
          <a href="#" className="text-sm font-medium flex items-center justify-between">ABOUT <ArrowUpRight size={14} /></a>
          <a href="#" className="text-sm font-medium flex items-center justify-between">SUPPORT <ArrowUpRight size={14} /></a>
        </div>
      </div>

      <div className="flex flex-col gap-6 mb-16">
        <h5 className="text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase">Policy</h5>
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <a href="#" className="text-xs text-white/60">Shipping Policy</a>
          <a href="#" className="text-xs text-white/60">Terms & Conditions</a>
          <a href="#" className="text-xs text-white/60">Privacy Policy</a>
          <a href="#" className="text-xs text-white/60">FAQ</a>
        </div>
      </div>

      <div className="text-center pt-10 border-t border-white/5">
        <p className="text-[10px] text-white/20 font-bold tracking-[0.2em]">© 2026 ONE WAY SHOES. ALL RIGHTS RESERVED.</p>
        <p className="text-[8px] text-white/10 mt-2">DESIGNED FOR THE FUTURE.</p>
      </div>
    </footer>
  );
}
