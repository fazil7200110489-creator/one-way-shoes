export interface Sneaker {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  sizes: number[];
  colors: string[];
  stock: number;
  trending?: boolean;
  featured?: boolean;
  limited?: boolean;
}

export const sneakers: Sneaker[] = [
  {
    id: "1",
    name: "CYBER CORE X1",
    price: 299,
    rating: 4.9,
    image: "/images/hero_sneaker.png",
    description: "The ultimate fusion of aerodynamics and comfort. Features reactive cushioning and a carbon fiber soul.",
    sizes: [7, 8, 9, 10, 11],
    colors: ["#000000", "#1c1c1c", "#00f2ff"],
    stock: 12,
    featured: true,
    trending: true,
  },
  {
    id: "2",
    name: "AURORA GHOST",
    price: 349,
    rating: 5.0,
    image: "/images/sneaker_white_gold.png",
    description: "Ethereal design meets elite performance. The Aurora Ghost glows in low light conditions.",
    sizes: [8, 9, 10, 11],
    colors: ["#ffffff", "#ffd700", "#e0e0e0"],
    stock: 5,
    featured: true,
  },
  {
    id: "3",
    name: "NOVA REDLINE",
    price: 275,
    rating: 4.8,
    image: "/images/sneaker_red_black.png",
    description: "Built for speed. The Nova Redline aggressive stance provides unmatched stability at high velocities.",
    sizes: [7, 8, 9, 10],
    colors: ["#000000", "#ff0000"],
    stock: 18,
    trending: true,
  },
  {
    id: "4",
    name: "ONYX STEALTH",
    price: 320,
    rating: 4.9,
    image: "/images/sneaker_all_black.png",
    description: "Total blackout aesthetic. The Onyx Stealth features a matte finish that absorbs light and attention.",
    sizes: [8, 9, 10, 11, 12],
    colors: ["#000000", "#121212"],
    stock: 8,
    limited: true,
  }
];
