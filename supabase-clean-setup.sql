-- ============================================================================
-- ZionTrack CLEAN Database Setup Script
-- This will completely reset your database with correct UUID structure
-- ============================================================================

-- ============================================================================
-- 1. COMPLETELY DROP ALL EXISTING TABLES AND FUNCTIONS
-- ============================================================================

-- Drop all tables in correct order (respecting foreign key dependencies)
DROP TABLE IF EXISTS indicator_entries CASCADE;
DROP TABLE IF EXISTS user_unit_roles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS units CASCADE;

-- Drop materialized views
DROP MATERIALIZED VIEW IF EXISTS mv_rollup_last_90 CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS is_stake_leader(uuid) CASCADE;
DROP FUNCTION IF EXISTS user_has_unit_access(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS user_has_unit_access(uuid, text) CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- ============================================================================
-- 2. CREATE FRESH TABLES WITH CORRECT UUID STRUCTURE
-- ============================================================================

-- Create Units table with UUID primary key
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('ward','branch')) NOT NULL,
  stake TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Profiles table
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
-- 3. INSERT FRESH SAMPLE DATA
-- ============================================================================

-- Insert Harare Zimbabwe South Stake units with proper structure
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

-- Function to check if user has access to a specific unit (UUID version)
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

-- Units policies
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

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================================
-- 8. INSERT SAMPLE INDICATOR DATA FOR TESTING
-- ============================================================================

-- Get a unit ID for sample data
DO $$
DECLARE
    sample_unit_id UUID;
BEGIN
    -- Get the first unit's ID
    SELECT id INTO sample_unit_id FROM units LIMIT 1;
    
    -- Insert some sample indicator entries for testing
    INSERT INTO indicator_entries (unit_id, indicator_key, period_start, value, notes) VALUES
    (sample_unit_id, 'sacrament_attendance', '2024-01-07', 85, 'Good attendance this week'),
    (sample_unit_id, 'convert_baptisms', '2024-01-07', 2, 'Two baptisms this week'),
    (sample_unit_id, 'sacrament_attendance', '2024-01-14', 92, 'Excellent attendance'),
    (sample_unit_id, 'ministering_interviews', '2024-01-14', 15, 'Monthly ministering interviews');
END $$;

-- ============================================================================
-- 9. VERIFICATION AND SUCCESS MESSAGE
-- ============================================================================

-- Show created tables
SELECT 
  'Tables Created' as status,
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('units', 'indicator_entries', 'profiles', 'user_unit_roles')
ORDER BY table_name;

-- Show sample units with their UUIDs
SELECT 
  'Sample Units' as status,
  id,
  unit_code,
  name,
  type
FROM units 
ORDER BY name;

-- Show sample indicator entries
SELECT 
  'Sample Data' as status,
  COUNT(*) as entry_count
FROM indicator_entries;

-- Final success message
SELECT 
  '✅ CLEAN DATABASE SETUP COMPLETE!' as status,
  'All old data removed, fresh structure created' as message,
  'Your ZionTrack database is ready with UUID structure' as next_step;
