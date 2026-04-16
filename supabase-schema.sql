-- FlareCross.com — Full Platform Schema
-- Run this in Supabase SQL Editor (supabase.com → SQL Editor)

-- ============================================================
-- PROFILES (extends auth.users 1:1)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'customer'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  type TEXT NOT NULL CHECK (type IN ('one_time', 'subscription', 'bundle')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  assigned_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  stripe_product_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PRICES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  nickname TEXT,
  unit_amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  interval TEXT CHECK (interval IN ('day', 'week', 'month', 'year')),
  stripe_price_id TEXT UNIQUE,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PRODUCT BUNDLE ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.product_bundle_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  price_id UUID REFERENCES public.prices(id) ON DELETE SET NULL,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'refunded', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  price_id UUID REFERENCES public.prices(id) ON DELETE SET NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'paused', 'unpaid')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MANAGED SITES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.managed_sites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TESTIMONIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  role TEXT,
  body TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PORTFOLIO ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  url TEXT,
  image_url TEXT,
  tags TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CONTACT LEADS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contact_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_bundle_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.managed_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_leads ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- products: public read for active+public; assigned user reads their private; service role writes
CREATE POLICY "Public can read active public products" ON public.products FOR SELECT
  USING (status = 'active' AND is_public = TRUE);
CREATE POLICY "Assigned user reads private product" ON public.products FOR SELECT
  USING (assigned_user_id = auth.uid());

-- prices: public read (needed for shop)
CREATE POLICY "Public can read prices" ON public.prices FOR SELECT USING (TRUE);

-- product_bundle_items: public read
CREATE POLICY "Public can read bundle items" ON public.product_bundle_items FOR SELECT USING (TRUE);

-- orders: users see own
CREATE POLICY "Users can read own orders" ON public.orders FOR SELECT USING (user_id = auth.uid());

-- subscriptions: users see own
CREATE POLICY "Users can read own subscriptions" ON public.subscriptions FOR SELECT USING (user_id = auth.uid());

-- managed_sites: users see own
CREATE POLICY "Users can read own managed sites" ON public.managed_sites FOR SELECT USING (user_id = auth.uid());

-- testimonials: public read active
CREATE POLICY "Public can read active testimonials" ON public.testimonials FOR SELECT USING (is_active = TRUE);

-- portfolio_items: public read active
CREATE POLICY "Public can read active portfolio items" ON public.portfolio_items FOR SELECT USING (is_active = TRUE);

-- contact_leads: no public read (admin only via service role)

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_assigned_user ON public.products(assigned_user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON public.subscriptions(stripe_subscription_id);

-- ============================================================
-- BLOG POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  slug         TEXT        NOT NULL UNIQUE,
  title        TEXT        NOT NULL,
  description  TEXT,
  excerpt      TEXT,
  content      TEXT,
  category     TEXT,
  reading_time TEXT,
  tags         TEXT[]      DEFAULT '{}',
  featured     BOOLEAN     NOT NULL DEFAULT FALSE,
  status       TEXT        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published blog posts"
  ON public.blog_posts FOR SELECT USING (status = 'published');

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts (status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts (published_at DESC);

-- ============================================================
-- BLOG API KEYS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.blog_api_keys (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT        NOT NULL,
  key_hash     TEXT        NOT NULL UNIQUE,
  key_prefix   TEXT        NOT NULL,
  is_active    BOOLEAN     NOT NULL DEFAULT TRUE,
  last_used_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.blog_api_keys ENABLE ROW LEVEL SECURITY;
-- No public policy — service role bypasses RLS

CREATE INDEX IF NOT EXISTS idx_blog_api_keys_key_hash ON public.blog_api_keys (key_hash);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON public.profiles(stripe_customer_id);

-- ============================================================
-- APP SETTINGS (admin-controlled runtime config)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.app_settings (
  key        TEXT        PRIMARY KEY,
  value      TEXT        NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Only service role can read/write (admin API uses service role key)
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Seed default: Stripe starts in live mode
INSERT INTO public.app_settings (key, value)
  VALUES ('stripe_test_mode', 'false')
  ON CONFLICT (key) DO NOTHING;
