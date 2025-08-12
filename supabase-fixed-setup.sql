-- ============================================================================
-- ZionTrack Database Setup Script (FIXED VERSION)
-- Run this entire script in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. DROP EXISTING TABLES (if they exist with wrong types)
-- ============================================================================

DROP TABLE IF EXISTS indicator_entries CASCADE;
DROP TABLE IF EXISTS user_unit_roles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS units CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_rollup_last_90;

-- ============================================================================
-- 2. CREATE TABLES WITH CORRECT DATA TYPES
-- ============================================================================

-- Create Units table with UUID primary key
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_code TEXT UNIQUE NOT NULL, -- Human-readable identifier
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('ward','branch')) NOT NULL,
  stake TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT CHECK (role IN ('stake_leader','unit_leader','viewer')) NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Indicator Entries table (main data table)
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

-- Create User-Unit Roles junction table
CREATE TABLE user_unit_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('stake_leader','unit_leader','viewer')) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, unit_id)
);

-- ============================================================================
-- 3. INSERT SAMPLE DATA
-- ============================================================================

-- Insert Harare Zimbabwe South Stake units
INSERT INTO units (unit_code, name, type, stake) VALUES
('harare1-ward', 'Harare 1st Ward', 'ward', 'Harare Zimbabwe South Stake'),
('harare2-ward', 'Harare 2nd Ward', 'ward', 'Harare Zimbabwe South Stake'),
('harare3-ward', 'Harare 3rd Ward', 'ward', 'Harare Zimbabwe South Stake'),
('chitungwiza-ward', 'Chitungwiza Ward', 'ward', 'Harare Zimbabwe South Stake'),
('norton-ward', 'Norton Ward', 'ward', 'Harare Zimbabwe South Stake'),
('ruwa-ward', 'Ruwa Ward', 'ward', 'Harare Zimbabwe South Stake'),
('ysa-branch', 'Young Single Adult Branch', 'branch', 'Harare Zimbabwe South Stake');

-- ============================================================================
-- 4. CREATE HELPER FUNCTIONS
-- ============================================================================

-- Function to check if user is stake leader
CREATE OR REPLACE FUNCTION is_stake_leader(uid UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
  SELECT EXISTS(SELECT 1 FROM profiles p WHERE p.id = uid AND p.role = 'stake_leader')
$$;

-- Function to check if user has access to a specific unit
CREATE OR REPLACE FUNCTION user_has_unit_access(uid UUID, target_unit UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
  SELECT is_stake_leader(uid)
  OR EXISTS(SELECT 1 FROM user_unit_roles r WHERE r.user_id = uid AND r.unit_id = target_unit)
$$;

-- ============================================================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicator_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_unit_roles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. CREATE RLS POLICIES
-- ============================================================================

-- Units policies (everyone can read units)
CREATE POLICY "Anyone can read units" ON units
FOR SELECT TO authenticated
USING (true);

-- Profiles policies
CREATE POLICY "Users can read all profiles" ON profiles
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id);

-- Indicator entries policies (main CRUD operations)
CREATE POLICY "Users can read entries for accessible units" ON indicator_entries
FOR SELECT TO authenticated
USING (user_has_unit_access(auth.uid(), unit_id));

CREATE POLICY "Users can insert entries for accessible units" ON indicator_entries
FOR INSERT TO authenticated
WITH CHECK (user_has_unit_access(auth.uid(), unit_id));

CREATE POLICY "Users can update entries for accessible units" ON indicator_entries
FOR UPDATE TO authenticated
USING (user_has_unit_access(auth.uid(), unit_id) OR auth.uid() = created_by)
WITH CHECK (user_has_unit_access(auth.uid(), unit_id) OR auth.uid() = created_by);

CREATE POLICY "Users can delete entries for accessible units" ON indicator_entries
FOR DELETE TO authenticated
USING (user_has_unit_access(auth.uid(), unit_id) OR auth.uid() = created_by);

-- User unit roles policies
CREATE POLICY "Users can read unit roles" ON user_unit_roles
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Stake leaders can manage unit roles" ON user_unit_roles
FOR ALL TO authenticated
USING (is_stake_leader(auth.uid()));

-- ============================================================================
-- 7. CREATE AUTOMATIC PROFILE CREATION TRIGGER
-- ============================================================================

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'viewer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================================
-- 8. VERIFICATION
-- ============================================================================

-- Show created tables
SELECT 
  'Tables Created Successfully' as status,
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('units', 'indicator_entries', 'profiles', 'user_unit_roles')
ORDER BY table_name;

-- Show sample units with their UUIDs
SELECT 
  'Sample Units Created' as status,
  id,
  unit_code,
  name,
  type
FROM units 
ORDER BY name;

-- Final success message
SELECT 
  '✅ DATABASE SETUP COMPLETE!' as status,
  'Your ZionTrack database is ready.' as message,
  'Next: Add environment variables and restart your app.' as next_step;