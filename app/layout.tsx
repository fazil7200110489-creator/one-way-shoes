import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import SplashScreen from "@/components/SplashScreen";
import MobileNav from "@/components/MobileNav";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ONE WAY SHOES | Luxury Futuristic Sneakers",
  description: "Move Different. Experience the future of premium footwear with ONE WAY SHOES. Cinematic designs, floating 3D sneakers, and elite performance.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-background text-foreground antialiased selection:bg-accent selection:text-background`}>
        <SplashScreen />
        {children}
        <MobileNav />
      </body>
    </html>
  );
}
