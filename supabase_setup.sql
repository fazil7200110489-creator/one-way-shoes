-- ==========================================================
-- FINAL SUPABASE MIGRATION SCRIPT FOR ONE WAY SHOES
-- ==========================================================
-- This script is designed to be run in the Supabase SQL Editor.
-- It creates the tables first to avoid "relation does not exist" errors.

-- 1. DATABASE TABLES (Create these first)
----------------------------------------------------------

-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    description TEXT,
    images TEXT[] DEFAULT '{}',
    sizes NUMERIC[] DEFAULT '{}',
    colors TEXT[] DEFAULT '{}',
    stock INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    trending BOOLEAN DEFAULT false,
    limited BOOLEAN DEFAULT false,
    rating NUMERIC DEFAULT 0
);

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    product_id UUID REFERENCES public.products(id),
    product_name TEXT,
    size NUMERIC,
    color TEXT,
    amount NUMERIC,
    payment_screenshot TEXT,
    status TEXT CHECK (status IN ('Pending', 'Verified', 'Rejected', 'Shipped', 'Delivered')) DEFAULT 'Pending'
);


-- 2. STORAGE SETUP (for Product Images)
----------------------------------------------------------

-- Ensure the 'products' bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;


-- 3. CLEANUP & RECREATE POLICIES
----------------------------------------------------------

-- A. Storage Policies (on storage.objects)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon deletes" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'products' );
CREATE POLICY "Allow uploads" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK ( bucket_id = 'products' );
CREATE POLICY "Allow updates" ON storage.objects FOR UPDATE TO anon, authenticated USING ( bucket_id = 'products' );
CREATE POLICY "Allow deletes" ON storage.objects FOR DELETE TO anon, authenticated USING ( bucket_id = 'products' );


-- B. Database Policies (on public.products and public.orders)
-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Products Policies
DROP POLICY IF EXISTS "Allow public read access" ON public.products;
DROP POLICY IF EXISTS "Allow admin full access" ON public.products;
DROP POLICY IF EXISTS "Allow anon full access (Dev Only)" ON public.products;

CREATE POLICY "Allow public read access" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow admin full access" ON public.products FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon full access (Dev Only)" ON public.products FOR ALL TO anon USING (true);

-- Orders Policies
DROP POLICY IF EXISTS "Allow public insert" ON public.orders;
DROP POLICY IF EXISTS "Allow admin read orders" ON public.orders;
DROP POLICY IF EXISTS "Allow admin update orders" ON public.orders;
DROP POLICY IF EXISTS "Allow anon full access (Dev Only)" ON public.orders;

CREATE POLICY "Allow public insert" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read orders" ON public.orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow admin update orders" ON public.orders FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow anon full access (Dev Only)" ON public.orders FOR ALL TO anon USING (true);
