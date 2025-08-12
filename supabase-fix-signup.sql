-- Fix signup issues - Run this if you're still getting database errors
-- This addresses common problems with user signup

-- First, let's make sure the trigger function is correct
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  selected_unit_id UUID;
BEGIN
  -- Debug: Log the trigger execution
  RAISE NOTICE 'handle_new_user triggered for user: %', NEW.id;
  
  -- Get unit_id from unit name if provided
  IF NEW.raw_user_meta_data->>'unit' IS NOT NULL AND NEW.raw_user_meta_data->>'unit' != '' THEN
    SELECT id INTO selected_unit_id 
    FROM units 
    WHERE name = NEW.raw_user_meta_data->>'unit' 
    LIMIT 1;
    
    RAISE NOTICE 'Selected unit: % -> %', NEW.raw_user_meta_data->>'unit', selected_unit_id;
  END IF;

  -- Insert into profiles
  INSERT INTO profiles (id, full_name, role, unit_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'viewer'),
    selected_unit_id
  );

  RAISE NOTICE 'Profile created for user: %', NEW.id;

  -- For unit leaders, automatically assign them to their unit
  IF COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'viewer') = 'unit-leader' AND selected_unit_id IS NOT NULL THEN
    INSERT INTO user_unit_roles (user_id, unit_id, role)
    VALUES (NEW.id, selected_unit_id, 'unit-leader')
    ON CONFLICT (user_id, unit_id) DO NOTHING;
    
    RAISE NOTICE 'Unit leader role assigned to unit: %', selected_unit_id;
  END IF;

  -- For stake leaders, assign them to all units
  IF COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'viewer') = 'stake-leader' THEN
    INSERT INTO user_unit_roles (user_id, unit_id, role)
    SELECT NEW.id, id, 'stake-leader'
    FROM units
    ON CONFLICT (user_id, unit_id) DO NOTHING;
    
    RAISE NOTICE 'Stake leader role assigned to all units';
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Check if we can insert a test profile manually
DO $$
BEGIN
  -- Test if we can insert into profiles
  INSERT INTO profiles (id, full_name, role) 
  VALUES (gen_random_uuid(), 'Test User', 'viewer')
  ON CONFLICT (id) DO NOTHING;
  
  RAISE NOTICE 'Test profile insert successful';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Test profile insert failed: %', SQLERRM;
END $$;

-- Clean up test data
DELETE FROM profiles WHERE full_name = 'Test User';

-- Verify setup
SELECT 'Setup Verification' as status,
       'Trigger function updated with debugging' as message;

-- Show current units for reference
SELECT 'Available Units' as category, name, unit_number 
FROM units 
ORDER BY unit_number;