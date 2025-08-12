-- Create Demo Users for Zion Track - Harare Zimbabwe South Stake
-- Run this to create test accounts with different roles

-- First, let's create some demo profiles manually
-- (These will be linked to real Supabase auth users when they sign up)

-- Get unit IDs for reference
DO $$
DECLARE
    harare1_id UUID;
    harare2_id UUID;
    chitungwiza_id UUID;
    norton_id UUID;
    ysa_id UUID;
BEGIN
    -- Get unit IDs
    SELECT id INTO harare1_id FROM units WHERE name = 'Harare 1st Ward';
    SELECT id INTO harare2_id FROM units WHERE name = 'Harare 2nd Ward';
    SELECT id INTO chitungwiza_id FROM units WHERE name = 'Chitungwiza Ward';
    SELECT id INTO norton_id FROM units WHERE name = 'Norton Ward';
    SELECT id INTO ysa_id FROM units WHERE name = 'Young Single Adult Branch';

    -- Create demo user profiles (these will be created when users actually sign up)
    -- But let's create some sample data to show what the system will look like

    RAISE NOTICE 'Demo Users Setup Instructions:';
    RAISE NOTICE '================================';
    RAISE NOTICE '';
    RAISE NOTICE '1. STAKE LEADER DEMO ACCOUNT:';
    RAISE NOTICE '   Email: stake.leader@harare.zw';
    RAISE NOTICE '   Password: StakeLeader123!';
    RAISE NOTICE '   Role: Stake Leader';
    RAISE NOTICE '   Access: All 7 units in Harare Zimbabwe South Stake';
    RAISE NOTICE '';
    RAISE NOTICE '2. UNIT LEADER DEMO ACCOUNT (Harare 1st Ward):';
    RAISE NOTICE '   Email: bishop.harare1@harare.zw';
    RAISE NOTICE '   Password: Bishop123!';
    RAISE NOTICE '   Role: Unit Leader';
    RAISE NOTICE '   Unit: Harare 1st Ward';
    RAISE NOTICE '   Access: Harare 1st Ward only';
    RAISE NOTICE '';
    RAISE NOTICE '3. UNIT LEADER DEMO ACCOUNT (Chitungwiza Ward):';
    RAISE NOTICE '   Email: bishop.chitungwiza@harare.zw';
    RAISE NOTICE '   Password: Bishop123!';
    RAISE NOTICE '   Role: Unit Leader';
    RAISE NOTICE '   Unit: Chitungwiza Ward';
    RAISE NOTICE '   Access: Chitungwiza Ward only';
    RAISE NOTICE '';
    RAISE NOTICE '4. VIEWER DEMO ACCOUNT:';
    RAISE NOTICE '   Email: clerk.harare2@harare.zw';
    RAISE NOTICE '   Password: Clerk123!';
    RAISE NOTICE '   Role: Viewer';
    RAISE NOTICE '   Unit: Harare 2nd Ward';
    RAISE NOTICE '   Access: Read-only access to Harare 2nd Ward';
    RAISE NOTICE '';
    RAISE NOTICE '5. YSA BRANCH LEADER DEMO ACCOUNT:';
    RAISE NOTICE '   Email: ysa.president@harare.zw';
    RAISE NOTICE '   Password: YSA123!';
    RAISE NOTICE '   Role: Unit Leader';
    RAISE NOTICE '   Unit: Young Single Adult Branch';
    RAISE NOTICE '   Access: YSA Branch only';
    RAISE NOTICE '';
    RAISE NOTICE 'TO CREATE THESE ACCOUNTS:';
    RAISE NOTICE '1. Go to http://localhost:3000';
    RAISE NOTICE '2. Click "Get Started"';
    RAISE NOTICE '3. Use the credentials above to sign up';
    RAISE NOTICE '4. Select the appropriate role and unit';
    RAISE NOTICE '';
    RAISE NOTICE 'Units available: Harare 1st Ward, Harare 2nd Ward, Harare 3rd Ward,';
    RAISE NOTICE '                Chitungwiza Ward, Norton Ward, Ruwa Ward, Young Single Adult Branch';

END $$;

-- Show current units for reference
SELECT 'Available Units for Demo' as info, 
       name as unit_name, 
       unit_number, 
       type,
       id as unit_id
FROM units 
ORDER BY unit_number;

-- Create a simple demo data view
CREATE OR REPLACE VIEW demo_setup_info AS
SELECT 
    'Demo Account Setup Complete' as status,
    'Use the credentials shown above to create test accounts' as instructions,
    COUNT(*) as total_units_available
FROM units;