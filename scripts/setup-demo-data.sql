-- Demo Data Setup for Zion Track
-- Run this after the main schema to populate with sample data

-- Insert sample units (wards/branches)
INSERT INTO units (id, name, unit_number, type) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'First Ward', '001', 'ward'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Second Ward', '002', 'ward'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Third Ward', '003', 'ward'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Young Single Adult Branch', '004', 'branch'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Spanish Branch', '005', 'branch')
ON CONFLICT (id) DO NOTHING;

-- Note: User profiles will be created automatically when users sign up
-- You can manually create test users and assign them to units using the following pattern:

-- Example: Create a test stake leader profile (replace with actual user ID after signup)
-- INSERT INTO profiles (id, full_name, role, stake) VALUES
--   ('user-id-here', 'John Smith', 'stake-leader', 'Provo Utah Stake');

-- Example: Assign user to units
-- INSERT INTO user_unit_roles (user_id, unit_id, role) VALUES
--   ('user-id-here', '550e8400-e29b-41d4-a716-446655440001', 'stake-leader'),
--   ('user-id-here', '550e8400-e29b-41d4-a716-446655440002', 'stake-leader');

-- Create a function to assign a user to all units (useful for stake leaders)
CREATE OR REPLACE FUNCTION assign_user_to_all_units(user_uuid UUID, user_role user_role DEFAULT 'viewer')
RETURNS void AS $$
BEGIN
  INSERT INTO user_unit_roles (user_id, unit_id, role)
  SELECT user_uuid, id, user_role
  FROM units
  ON CONFLICT (user_id, unit_id) DO UPDATE SET role = user_role;
END;
$$ LANGUAGE plpgsql;

-- Create a function to assign a user to a specific unit
CREATE OR REPLACE FUNCTION assign_user_to_unit(user_uuid UUID, unit_uuid UUID, user_role user_role DEFAULT 'viewer')
RETURNS void AS $$
BEGIN
  INSERT INTO user_unit_roles (user_id, unit_id, role)
  VALUES (user_uuid, unit_uuid, user_role)
  ON CONFLICT (user_id, unit_id) DO UPDATE SET role = user_role;
END;
$$ LANGUAGE plpgsql;

-- Example usage after a user signs up:
-- SELECT assign_user_to_all_units('user-id-here', 'stake-leader');
-- SELECT assign_user_to_unit('user-id-here', '550e8400-e29b-41d4-a716-446655440001', 'unit-leader');