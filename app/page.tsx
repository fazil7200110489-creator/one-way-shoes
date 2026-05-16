import SplashScreen from "@/components/SplashScreen";
import Hero from "@/components/Hero";
import FeaturedCollection from "@/components/FeaturedCollection";
import TrendingShoes from "@/components/TrendingShoes";
import LimitedEdition from "@/components/LimitedEdition";
import Reviews from "@/components/Reviews";
import Instagram from "@/components/Instagram";
import Footer from "@/components/Footer";
import { ShoppingBag, User, Search, Menu } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white relative">
      <SplashScreen />

      {/* Premium Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center glass-dark">
        <div className="flex items-center gap-2">
          <Menu size={20} className="text-white/60" />
        </div>

        <h1 className="text-xl font-heading font-black tracking-tighter">ONE WAY</h1>

        <div className="flex items-center gap-4">
          <Search size={20} className="text-white/60" />
          <div className="relative">
            <ShoppingBag size={20} className="text-white/60" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full" />
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="relative z-0">
        <Hero />
        <FeaturedCollection />
        <TrendingShoes />
        <LimitedEdition />
        <Reviews />

        <Instagram />

        <Footer />
      </div>

      {/* Bottom Sticky Navigation (Mobile) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] glass-dark rounded-full px-8 py-4 z-50 flex justify-between items-center border border-white/10 glow-white">
        <button className="text-accent"><ShoppingBag size={24} /></button>
        <button className="text-white/40"><Search size={24} /></button>
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center -mt-10 border-4 border-black">
          <div className="w-6 h-6 bg-black rounded-sm rotate-45" />
        </div>
        <button className="text-white/40"><User size={24} /></button>
        <button className="text-white/40"><Menu size={24} /></button>
      </div>
    </main>
  );
}
