"use client";

import Image from "next/image";
import { Instagram as InstagramIcon, Heart, MessageCircle } from "lucide-react";

const INSTA_POSTS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop",
    likes: "1.2k",
    comments: "45",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    likes: "890",
    comments: "32",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    likes: "2.5k",
    comments: "128",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop",
    likes: "1.7k",
    comments: "56",
  },
];

export default function Instagram() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tighter mb-2">
            INSTAGRAM
          </h2>
          <p className="text-white/40 text-lg">Join the movement #ONEWAY</p>
        </div>
        <a 
          href="https://instagram.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-accent hover:text-white transition-colors group"
        >
          <InstagramIcon size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="font-bold tracking-tight">FOLLOW US</span>
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {INSTA_POSTS.map((post) => (
          <div 
            key={post.id} 
            className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer"
          >
            <Image
              src={post.image}
              alt={`Instagram post ${post.id}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <Heart size={20} fill="white" />
                <span className="font-bold">{post.likes}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle size={20} fill="white" />
                <span className="font-bold">{post.comments}</span>
              </div>
            </div>

            {/* Premium Border Gradient */}
            <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none group-hover:border-accent/50 transition-colors" />
          </div>
        ))}
      </div>
    </section>
  );
}
