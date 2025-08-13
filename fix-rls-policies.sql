-- Fix RLS policies to allow access to units table
-- Run this in Supabase SQL Editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can read units" ON units;
DROP POLICY IF EXISTS "Users can read entries for accessible units" ON indicator_entries;
DROP POLICY IF EXISTS "Users can insert entries for accessible units" ON indicator_entries;
DROP POLICY IF EXISTS "Users can update entries for accessible units" ON indicator_entries;
DROP POLICY IF EXISTS "Users can delete entries for accessible units" ON indicator_entries;

-- Create simple policies that allow access
CREATE POLICY "Allow all access to units" ON units
FOR ALL TO authenticated, anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all access to indicator_entries" ON indicator_entries
FOR ALL TO authenticated, anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all access to profiles" ON profiles
FOR ALL TO authenticated, anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all access to user_unit_roles" ON user_unit_roles
FOR ALL TO authenticated, anon
USING (true)
WITH CHECK (true);

-- Verify units are accessible
SELECT 'Units accessible:' as status, COUNT(*) as count FROM units;
SELECT 'Sample units:' as info, name, type FROM units LIMIT 3;