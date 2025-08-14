-- Just insert the sample data (tables already exist)
-- Run this in Supabase SQL Editor

-- Insert sample units
INSERT INTO units (unit_code, name, type, stake) VALUES
('harare1-ward', 'Harare 1st Ward', 'ward', 'Harare Zimbabwe South Stake'),
('harare2-ward', 'Harare 2nd Ward', 'ward', 'Harare Zimbabwe South Stake'),
('harare3-ward', 'Harare 3rd Ward', 'ward', 'Harare Zimbabwe South Stake'),
('chitungwiza-ward', 'Chitungwiza Ward', 'ward', 'Harare Zimbabwe South Stake'),
('norton-ward', 'Norton Ward', 'ward', 'Harare Zimbabwe South Stake'),
('ruwa-ward', 'Ruwa Ward', 'ward', 'Harare Zimbabwe South Stake'),
('ysa-branch', 'Young Single Adult Branch', 'branch', 'Harare Zimbabwe South Stake')
ON CONFLICT (unit_code) DO NOTHING;

-- Insert sample indicator data
DO $$
DECLARE
    sample_unit_id UUID;
BEGIN
    -- Get the first unit's ID
    SELECT id INTO sample_unit_id FROM units LIMIT 1;
    
    -- Only insert if we have a unit
    IF sample_unit_id IS NOT NULL THEN
        INSERT INTO indicator_entries (unit_id, indicator_key, period_start, value, notes) VALUES
        (sample_unit_id, 'sacrament_attendance', '2024-01-07', 85, 'Good attendance this week'),
        (sample_unit_id, 'convert_baptisms', '2024-01-07', 2, 'Two baptisms this week'),
        (sample_unit_id, 'sacrament_attendance', '2024-01-14', 92, 'Excellent attendance'),
        (sample_unit_id, 'ministering_interviews', '2024-01-14', 15, 'Monthly ministering interviews');
    END IF;
END $$;

-- Verify the data was inserted
SELECT 'Units inserted:' as status, COUNT(*) as count FROM units;
SELECT 'Sample entries:' as status, COUNT(*) as count FROM indicator_entries;

-- Show the units
SELECT 'Available units:' as info, id, name, type FROM units ORDER BY name;
