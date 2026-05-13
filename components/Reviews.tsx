"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const reviews = [
  {
    id: 1,
    user: "Alex Rivera",
    role: "Collector",
    content: "The futuristic design is unlike anything I've seen. The comfort is top-tier.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: 2,
    user: "Sarah Chen",
    role: "Athlete",
    content: "Perfect balance of style and performance. ONE WAY is truly moving different.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=2",
  },
  {
    id: 3,
    user: "Marcus Vane",
    role: "Designer",
    content: "Every detail feels intentional. The glassmorphism packaging is a nice touch.",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?u=3",
  },
];

export default function Reviews() {
  return (
    <section className="py-20 px-6">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-heading font-black tracking-tight">VOICES</h2>
        <p className="text-white/40 text-sm">What the community says</p>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar snap-x">
        {reviews.map((review, idx) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-shrink-0 w-[300px] glass rounded-[2rem] p-6 snap-center"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-accent/20">
                <Image src={review.avatar} alt={review.user} fill className="object-cover" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm">{review.user}</h4>
                <p className="text-[10px] text-accent font-medium uppercase tracking-widest">{review.role}</p>
              </div>
            </div>
            
            <p className="text-sm text-white/70 italic mb-4">"{review.content}"</p>
            
            <div className="flex gap-1">
              {[...Array(review.rating)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xs">★</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
