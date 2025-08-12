-- Debug script to check what's happening with user signup
-- Run this to see the current state of your database

-- Check if tables exist
SELECT 'Tables Status' as category, 
       table_name, 
       CASE WHEN table_name IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'units', 'user_unit_roles')
ORDER BY table_name;

-- Check if user_role type exists
SELECT 'Types Status' as category,
       'user_role' as type_name,
       CASE WHEN typname IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
FROM pg_type 
WHERE typname = 'user_role';

-- Check if functions exist
SELECT 'Functions Status' as category,
       routine_name as function_name,
       CASE WHEN routine_name IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('handle_new_user', 'update_updated_at_column');

-- Check if triggers exist
SELECT 'Triggers Status' as category,
       trigger_name,
       event_object_table as table_name,
       CASE WHEN trigger_name IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
  AND trigger_name = 'on_auth_user_created';

-- Check units data
SELECT 'Units Data' as category,
       name as unit_name,
       unit_number,
       type
FROM units
ORDER BY unit_number;

-- Check profiles table structure
SELECT 'Profiles Columns' as category,
       column_name,
       data_type,
       is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT 'RLS Policies' as category,
       schemaname,
       tablename,
       policyname,
       CASE WHEN policyname IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;