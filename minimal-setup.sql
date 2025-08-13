-- Minimal ZionTrack Database Setup
-- Run this if the full script fails

-- Drop existing tables if they exist
DROP TABLE IF EXISTS indicator_entries CASCADE;
DROP TABLE IF EXISTS user_unit_roles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS units CASCADE;

-- Create units table
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('ward','branch')) NOT NULL,
  stake TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT CHECK (role IN ('stake_leader','unit_leader','viewer')) NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indicator entries table
CREATE TABLE indicator_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id) NOT NULL,
  indicator_key TEXT NOT NULL,
  period_start DATE NOT NULL,
  value INTEGER NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user unit roles table
CREATE TABLE user_unit_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('stake_leader','unit_leader','viewer')) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, unit_id)
);

-- Insert sample units
INSERT INTO units (unit_code, name, type, stake) VALUES
('harare1-ward', 'Harare 1st Ward', 'ward', 'Harare Zimbabwe South Stake'),
('harare2-ward', 'Harare 2nd Ward', 'ward', 'Harare Zimbabwe South Stake'),
('harare3-ward', 'Harare 3rd Ward', 'ward', 'Harare Zimbabwe South Stake'),
('chitungwiza-ward', 'Chitungwiza Ward', 'ward', 'Harare Zimbabwe South Stake'),
('norton-ward', 'Norton Ward', 'ward', 'Harare Zimbabwe South Stake'),
('ruwa-ward', 'Ruwa Ward', 'ward', 'Harare Zimbabwe South Stake'),
('ysa-branch', 'Young Single Adult Branch', 'branch', 'Harare Zimbabwe South Stake');

-- Enable RLS
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicator_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_unit_roles ENABLE ROW LEVEL SECURITY;

-- Basic policies (allow all for now)
CREATE POLICY "Allow all on units" ON units FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all on profiles" ON profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all on indicator_entries" ON indicator_entries FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all on user_unit_roles" ON user_unit_roles FOR ALL TO authenticated USING (true);

-- Verify setup
SELECT 'Setup Complete!' as status, COUNT(*) as unit_count FROM units;