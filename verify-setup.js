// Comprehensive setup verification script
// Run with: node verify-setup.js

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Check environment variables
console.log('🔍 Checking setup...\n')

// 1. Check .env.local file
if (!fs.existsSync('.env.local')) {
    console.log('❌ .env.local file not found')
    process.exit(1)
}

const envContent = fs.readFileSync('.env.local', 'utf8')
const hasUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=https://')
const hasKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ')

if (!hasUrl || !hasKey) {
    console.log('❌ Environment variables not properly configured')
    console.log('   Make sure .env.local has valid NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    process.exit(1)
}

console.log('✅ Environment variables configured')

// 2. Test database connection
const supabaseUrl = 'https://fpwwlyekaepmctsndsqp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwd3dseWVrYWVwbWN0c25kc3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODkxNjQsImV4cCI6MjA3MDU2NTE2NH0.h3hDkQFPXuh1GJ83fVXxPHXDl-U0JNQS8-JFNZnLyyQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifySetup() {
    try {
        // Test 1: Check if tables exist
        console.log('🔍 Checking database tables...')

        const { data: tables, error: tablesError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .in('table_name', ['units', 'profiles', 'indicator_entries', 'user_unit_roles'])

        if (tablesError) {
            console.log('❌ Cannot check tables:', tablesError.message)
            return
        }

        const requiredTables = ['units', 'profiles', 'indicator_entries', 'user_unit_roles']
        const existingTables = tables?.map(t => t.table_name) || []
        const missingTables = requiredTables.filter(t => !existingTables.includes(t))

        if (missingTables.length > 0) {
            console.log('❌ Missing tables:', missingTables.join(', '))
            console.log('   Run the supabase-clean-setup.sql script in your Supabase dashboard')
            return
        }

        console.log('✅ All required tables exist')

        // Test 2: Check if units exist
        console.log('🔍 Checking sample data...')

        const { data: units, error: unitsError } = await supabase
            .from('units')
            .select('id, name, type')
            .limit(5)

        if (unitsError) {
            console.log('❌ Cannot fetch units:', unitsError.message)
            return
        }

        if (!units || units.length === 0) {
            console.log('❌ No units found in database')
            console.log('   Run the supabase-clean-setup.sql script to create sample data')
            return
        }

        console.log('✅ Sample units found:')
        units.forEach(unit => {
            console.log(`   - ${unit.name} (${unit.type})`)
        })

        // Test 3: Test CRUD operations
        console.log('🔍 Testing CRUD operations...')

        const testUnitId = units[0].id

        // CREATE
        const { data: newEntry, error: createError } = await supabase
            .from('indicator_entries')
            .insert({
                unit_id: testUnitId,
                indicator_key: 'test_verification',
                period_start: '2024-01-01',
                value: 999,
                notes: 'Verification test entry'
            })
            .select()
            .single()

        if (createError) {
            console.log('❌ CREATE failed:', createError.message)
            return
        }

        console.log('✅ CREATE operation successful')

        // READ
        const { data: readEntry, error: readError } = await supabase
            .from('indicator_entries')
            .select('*')
            .eq('id', newEntry.id)
            .single()

        if (readError) {
            console.log('❌ READ failed:', readError.message)
            return
        }

        console.log('✅ READ operation successful')

        // UPDATE
        const { error: updateError } = await supabase
            .from('indicator_entries')
            .update({ value: 1000, notes: 'Updated verification test' })
            .eq('id', newEntry.id)

        if (updateError) {
            console.log('❌ UPDATE failed:', updateError.message)
            return
        }

        console.log('✅ UPDATE operation successful')

        // DELETE
        const { error: deleteError } = await supabase
            .from('indicator_entries')
            .delete()
            .eq('id', newEntry.id)

        if (deleteError) {
            console.log('❌ DELETE failed:', deleteError.message)
            return
        }

        console.log('✅ DELETE operation successful')

        console.log('\n🎉 ALL TESTS PASSED!')
        console.log('Your ZionTrack application is ready to use!')
        console.log('\nNext steps:')
        console.log('1. Run: npm run dev')
        console.log('2. Visit: http://localhost:3000/data-entry')
        console.log('3. Test the CRUD operations in the UI')

    } catch (error) {
        console.log('❌ Verification failed:', error.message)
    }
}

verifySetup()
