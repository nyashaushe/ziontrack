-- ============================================================================
-- ZionTrack Complete Database Setup Script
-- Run this entire script in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. CREATE TABLES
-- ============================================================================

-- Create Units table
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('ward','branch')) NOT NULL,
  stake TEXT NOT NULL,
  unit_code TEXT UNIQUE NOT NULL -- Human-readable identifier
);

-- Create Indicator Entries table (main data table)
CREATE TABLE IF NOT EXISTS indicator_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id) NOT NULL,
  indicator_key TEXT NOT NULL,
  period_start DATE NOT NULL,
  value INTEGER NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT CHECK (role IN ('stake_leader','unit_leader','viewer')) NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create User-Unit Roles junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS user_unit_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('stake_leader','unit_leader','viewer')) NOT NULL,
  PRIMARY KEY (user_id, unit_id)
);

-- ============================================================================
-- 2. INSERT SAMPLE DATA
-- ============================================================================

-- Insert Harare Zimbabwe South Stake units
INSERT INTO units (unit_code, name, type, stake) VALUES
('harare1-ward', 'Harare 1st Ward', 'ward', 'Harare Zimbabwe South Stake'),
('harare2-ward', 'Harare 2nd Ward', 'ward', 'Harare Zimbabwe South Stake'),
('harare3-ward', 'Harare 3rd Ward', 'ward', 'Harare Zimbabwe South Stake'),
('chitungwiza-ward', 'Chitungwiza Ward', 'ward', 'Harare Zimbabwe South Stake'),
('norton-ward', 'Norton Ward', 'ward', 'Harare Zimbabwe South Stake'),
('ruwa-ward', 'Ruwa Ward', 'ward', 'Harare Zimbabwe South Stake'),
('ysa-branch', 'Young Single Adult Branch', 'branch', 'Harare Zimbabwe South Stake')
ON CONFLICT (unit_code) DO NOTHING;

-- ============================================================================
-- 3. CREATE HELPER FUNCTIONS
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
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE indicator_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_unit_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. CREATE RLS POLICIES
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read entries for their units" ON indicator_entries;
DROP POLICY IF EXISTS "Users can insert entries for their units" ON indicator_entries;
DROP POLICY IF EXISTS "Users can update entries for their units" ON indicator_entries;
DROP POLICY IF EXISTS "Users can delete entries for their units" ON indicator_entries;
DROP POLICY IF EXISTS "Users can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read unit roles" ON user_unit_roles;
DROP POLICY IF EXISTS "Stake leaders can manage unit roles" ON user_unit_roles;
DROP POLICY IF EXISTS "Users can read units" ON units;

-- Policies for indicator_entries table (main CRUD operations)
CREATE POLICY "Users can read entries for their units" ON indicator_entries
FOR SELECT TO authenticated
USING (user_has_unit_access(auth.uid(), unit_id));

CREATE POLICY "Users can insert entries for their units" ON indicator_entries
FOR INSERT TO authenticated
WITH CHECK (user_has_unit_access(auth.uid(), unit_id));

CREATE POLICY "Users can update entries for their units" ON indicator_entries
FOR UPDATE TO authenticated
USING (user_has_unit_access(auth.uid(), unit_id) OR auth.uid() = created_by)
WITH CHECK (user_has_unit_access(auth.uid(), unit_id) OR auth.uid() = created_by);

CREATE POLICY "Users can delete entries for their units" ON indicator_entries
FOR DELETE TO authenticated
USING (user_has_unit_access(auth.uid(), unit_id) OR auth.uid() = created_by);

-- Policies for profiles table
CREATE POLICY "Users can read all profiles" ON profiles
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

-- Policies for user_unit_roles table
CREATE POLICY "Users can read unit roles" ON user_unit_roles
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Stake leaders can manage unit roles" ON user_unit_roles
FOR ALL TO authenticated
USING (is_stake_leader(auth.uid()));

-- Policies for units table
CREATE POLICY "Users can read units" ON units
FOR SELECT TO authenticated
USING (true);

-- ============================================================================
-- 6. CREATE TRIGGERS FOR AUTOMATIC PROFILE CREATION
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

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================================
-- 7. CREATE MATERIALIZED VIEW FOR ANALYTICS (OPTIONAL)
-- ============================================================================

-- Drop and recreate materialized view for rollup data
DROP MATERIALIZED VIEW IF EXISTS mv_rollup_last_90;
CREATE MATERIALIZED VIEW mv_rollup_last_90 AS
SELECT
  unit_id,
  indicator_key,
  SUM(value) as total_value,
  MIN(period_start) as start_date,
  MAX(period_start) as end_date,
  COUNT(*) as entry_count
FROM indicator_entries
WHERE period_start >= (CURRENT_DATE - INTERVAL '90 days')
GROUP BY unit_id, indicator_key;

-- Grant access to materialized view
GRANT SELECT ON mv_rollup_last_90 TO authenticated;

-- ============================================================================
-- 8. VERIFICATION QUERIES
-- ============================================================================

-- Verify tables were created
SELECT 
  'Tables Created' as status,
  table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('units', 'indicator_entries', 'profiles', 'user_unit_roles');

-- Verify sample data was inserted
SELECT 
  'Sample Units' as status,
  COUNT(*) as unit_count 
FROM units;

-- Show available units
SELECT 
  'Available Units' as info,
  id,
  unit_code,
  name,
  type
FROM units 
ORDER BY name;

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================

SELECT 
  '✅ Database Setup Complete!' as status,
  'Your ZionTrack database is ready to use.' as message,
  'Next: Add your Supabase credentials to .env.local' as next_step;