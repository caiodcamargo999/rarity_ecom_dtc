-- ==========================================================
-- RARITY AGENCY & HERITIE LANDING PAGES TELEMETRY & ANALYTICS SCHEMA
-- Execute this script in your Supabase SQL Editor
-- ==========================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. VISITORS TABLE (Tracks persistent user identity & first touch)
CREATE TABLE IF NOT EXISTS analytics_visitors (
    visitor_id TEXT PRIMARY KEY,
    first_touch_utm_source TEXT,
    first_touch_utm_medium TEXT,
    first_touch_utm_campaign TEXT,
    first_touch_utm_content TEXT,
    first_touch_utm_term TEXT,
    first_touch_referrer TEXT,
    first_touch_landing_page TEXT,
    last_touch_landing_page TEXT,
    email TEXT,
    phone TEXT,
    full_name TEXT,
    company_name TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    ip_address TEXT,
    country TEXT,
    region TEXT,
    state TEXT,
    city TEXT,
    total_sessions INTEGER DEFAULT 1,
    total_pageviews INTEGER DEFAULT 1,
    first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safe migrations if table already exists
ALTER TABLE analytics_visitors ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE analytics_visitors ADD COLUMN IF NOT EXISTS state TEXT;

-- 2. SESSIONS TABLE (Tracks individual user sessions - 30 min window)
CREATE TABLE IF NOT EXISTS analytics_sessions (
    session_id TEXT PRIMARY KEY,
    visitor_id TEXT NOT NULL REFERENCES analytics_visitors(visitor_id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_seconds INTEGER DEFAULT 0,
    pageviews_count INTEGER DEFAULT 1,
    entry_path TEXT,
    exit_path TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    referrer TEXT,
    device TEXT,
    screen_resolution TEXT
);

-- 3. PAGEVIEWS TABLE (Tracks every route visited & time on page)
CREATE TABLE IF NOT EXISTS analytics_pageviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    visitor_id TEXT NOT NULL,
    pathname TEXT NOT NULL,
    title TEXT,
    search_params TEXT,
    referrer TEXT,
    scroll_depth_max INTEGER DEFAULT 0,
    duration_seconds INTEGER DEFAULT 0,
    is_bounce BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. EVENTS TABLE (Clicks, VTurb video plays, scroll milestones, modal interactions)
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    visitor_id TEXT NOT NULL,
    pathname TEXT NOT NULL,
    event_type TEXT NOT NULL, -- 'cta_click', 'scroll_milestone', 'vturb_play', 'vturb_milestone', 'modal_open', 'form_step', 'lead_identified', 'cal_booked'
    event_name TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. LEADS TABLE (Form captures & Cal.com bookings stitched to visitor)
CREATE TABLE IF NOT EXISTS analytics_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visitor_id TEXT,
    session_id TEXT,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    brand_or_store TEXT,
    monthly_revenue TEXT,
    monthly_ad_spend TEXT,
    bottleneck TEXT,
    role TEXT,
    scheduled_on_cal TEXT DEFAULT 'No',
    meeting_date TEXT,
    source TEXT DEFAULT 'Landing Page',
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CREATE PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_analytics_visitors_last_seen ON analytics_visitors(last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_visitors_email ON analytics_visitors(email);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_visitor ON analytics_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_started ON analytics_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_session ON analytics_pageviews(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_pathname ON analytics_pageviews(pathname);
CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_created ON analytics_pageviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor ON analytics_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_leads_visitor ON analytics_leads(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_leads_email ON analytics_leads(email);
CREATE INDEX IF NOT EXISTS idx_analytics_leads_created ON analytics_leads(created_at DESC);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE analytics_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_pageviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_leads ENABLE ROW LEVEL SECURITY;

-- Allow anon insertions for telemetry ingestion (service role can read/write everything)
CREATE POLICY "Allow anon insert to analytics_visitors" ON analytics_visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update to analytics_visitors" ON analytics_visitors FOR UPDATE USING (true);
CREATE POLICY "Allow anon insert to analytics_sessions" ON analytics_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update to analytics_sessions" ON analytics_sessions FOR UPDATE USING (true);
CREATE POLICY "Allow anon insert to analytics_pageviews" ON analytics_pageviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update to analytics_pageviews" ON analytics_pageviews FOR UPDATE USING (true);
CREATE POLICY "Allow anon insert to analytics_events" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon insert to analytics_leads" ON analytics_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update to analytics_leads" ON analytics_leads FOR UPDATE USING (true);
