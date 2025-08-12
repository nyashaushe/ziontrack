-- Zion Track Database Schema - Incremental Update
-- Run this in your Supabase SQL Editor
-- This version handles existing objects gracefully

-- Create custom types (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('stake-leader', 'unit-leader', 'viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role user_role DEFAULT 'viewer',
  unit_id UUID REFERENCES units(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Units table (for church units/wards in Harare Zimbabwe South Stake)
CREATE TABLE IF NOT EXISTS units (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  unit_number TEXT,
  type TEXT DEFAULT 'ward', -- ward, branch, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User unit roles (many-to-many relationship)
CREATE TABLE IF NOT EXISTS user_unit_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  role user_role DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, unit_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_unit_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (with all possible names)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Stake leaders can view all profiles in their stake" ON profiles;
DROP POLICY IF EXISTS "Stake leaders can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view units they have access to" ON units;
DROP POLICY IF EXISTS "Users can view their own unit roles" ON user_unit_roles;
DROP POLICY IF EXISTS "Stake leaders can view all unit roles in their stake" ON user_unit_roles;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Stake leaders can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'stake-leader'
    )
  );

-- Units policies
CREATE POLICY "Users can view units they have access to" ON units
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_unit_roles uur 
      WHERE uur.unit_id = units.id 
      AND uur.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'stake-leader'
    )
  );

-- User unit roles policies
CREATE POLICY "Users can view their own unit roles" ON user_unit_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Stake leaders can view all unit roles in their stake" ON user_unit_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'stake-leader'
    )
  );

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  selected_unit_id UUID;
BEGIN
  -- Get unit_id from unit name if provided
  IF NEW.raw_user_meta_data->>'unit' IS NOT NULL THEN
    SELECT id INTO selected_unit_id 
    FROM units 
    WHERE name = NEW.raw_user_meta_data->>'unit' 
    LIMIT 1;
  END IF;

  INSERT INTO profiles (id, full_name, role, unit_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'viewer'),
    selected_unit_id
  );

  -- For unit leaders, automatically assign them to their unit
  IF COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'viewer') = 'unit-leader' AND selected_unit_id IS NOT NULL THEN
    INSERT INTO user_unit_roles (user_id, unit_id, role)
    VALUES (NEW.id, selected_unit_id, 'unit-leader');
  END IF;

  -- For stake leaders, assign them to all units
  IF COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'viewer') = 'stake-leader' THEN
    INSERT INTO user_unit_roles (user_id, unit_id, role)
    SELECT NEW.id, id, 'stake-leader'
    FROM units;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_units_updated_at ON units;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert Harare Zimbabwe South Stake units (only if not exists)
INSERT INTO units (name, unit_number, type) 
SELECT 'Harare 1st Ward', '001', 'ward'
WHERE NOT EXISTS (SELECT 1 FROM units WHERE name = 'Harare 1st Ward');

INSERT INTO units (name, unit_number, type) 
SELECT 'Harare 2nd Ward', '002', 'ward'
WHERE NOT EXISTS (SELECT 1 FROM units WHERE name = 'Harare 2nd Ward');

INSERT INTO units (name, unit_number, type) 
SELECT 'Harare 3rd Ward', '003', 'ward'
WHERE NOT EXISTS (SELECT 1 FROM units WHERE name = 'Harare 3rd Ward');

INSERT INTO units (name, unit_number, type) 
SELECT 'Chitungwiza Ward', '004', 'ward'
WHERE NOT EXISTS (SELECT 1 FROM units WHERE name = 'Chitungwiza Ward');

INSERT INTO units (name, unit_number, type) 
SELECT 'Norton Ward', '005', 'ward'
WHERE NOT EXISTS (SELECT 1 FROM units WHERE name = 'Norton Ward');

INSERT INTO units (name, unit_number, type) 
SELECT 'Ruwa Ward', '006', 'ward'
WHERE NOT EXISTS (SELECT 1 FROM units WHERE name = 'Ruwa Ward');

INSERT INTO units (name, unit_number, type) 
SELECT 'Young Single Adult Branch', '007', 'branch'
WHERE NOT EXISTS (SELECT 1 FROM units WHERE name = 'Young Single Adult Branch');

-- Verify setup
SELECT 'Schema setup completed successfully!' as status;