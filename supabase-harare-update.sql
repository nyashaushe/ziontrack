-- Harare Zimbabwe South Stake - Simple Update
-- Run this to update existing schema for Harare Stake

-- Add unit_id column to profiles if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'unit_id') THEN
        ALTER TABLE profiles ADD COLUMN unit_id UUID REFERENCES units(id);
    END IF;
END $$;

-- Remove stake column if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'stake') THEN
        ALTER TABLE profiles DROP COLUMN stake;
    END IF;
END $$;

-- Remove area column if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'area') THEN
        ALTER TABLE profiles DROP COLUMN area;
    END IF;
END $$;

-- Update units table to remove stake_id if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'units' AND column_name = 'stake_id') THEN
        ALTER TABLE units DROP COLUMN stake_id;
    END IF;
END $$;

-- Clear existing units and add Harare units
DELETE FROM units;

-- Insert Harare Zimbabwe South Stake units
INSERT INTO units (name, unit_number, type) VALUES
  ('Harare 1st Ward', '001', 'ward'),
  ('Harare 2nd Ward', '002', 'ward'),
  ('Harare 3rd Ward', '003', 'ward'),
  ('Chitungwiza Ward', '004', 'ward'),
  ('Norton Ward', '005', 'ward'),
  ('Ruwa Ward', '006', 'ward'),
  ('Young Single Adult Branch', '007', 'branch');

-- Update the user signup function
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

-- Update the stake leader policy (drop and recreate with new name)
DROP POLICY IF EXISTS "Stake leaders can view all profiles in their stake" ON profiles;
DROP POLICY IF EXISTS "Stake leaders can view all profiles" ON profiles;

CREATE POLICY "Stake leaders can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'stake-leader'
    )
  );

-- Verify setup
SELECT 'Harare Zimbabwe South Stake setup completed!' as status,
       COUNT(*) as unit_count
FROM units;