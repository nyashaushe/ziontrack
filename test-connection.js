// Test the exact connection issue
// Run with: node test-connection.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://fpwwlyekaepmctsndsqp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwd3dseWVrYWVwbWN0c25kc3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODkxNjQsImV4cCI6MjA3MDU2NTE2NH0.h3hDkQFPXuh1GJ83fVXxPHXDl-U0JNQS8-JFNZnLyyQ'

console.log('🔍 Testing Connection Issue...\n')

async function testConnection() {
    try {
        console.log('1. Creating Supabase client...')
        const supabase = createClient(supabaseUrl, supabaseKey)
        console.log('✅ Client created')

        console.log('\n2. Testing basic connection...')
        const { data: healthCheck, error: healthError } = await supabase
            .from('units')
            .select('count')
            .limit(0)

        if (healthError) {
            console.log('❌ Connection failed:', healthError.message)
            console.log('   Code:', healthError.code)
            console.log('   Details:', healthError.details)

            if (healthError.message.includes('permission denied') || healthError.message.includes('RLS')) {
                console.log('\n🔧 SOLUTION: RLS Policy Issue')
                console.log('   Run the fix-rls-policies.sql script in Supabase dashboard')
                console.log('   This will fix the permission policies')
            }
            return
        }

        console.log('✅ Basic connection works')

        console.log('\n3. Testing units query...')
        const { data: units, error: unitsError } = await supabase
            .from('units')
            .select('id, name, type')

        if (unitsError) {
            console.log('❌ Units query failed:', unitsError.message)
            console.log('   This is likely an RLS (Row Level Security) issue')
            console.log('\n🔧 SOLUTION:')
            console.log('   1. Go to Supabase dashboard')
            console.log('   2. SQL Editor → New Query')
            console.log('   3. Run the fix-rls-policies.sql script')
            return
        }

        if (!units || units.length === 0) {
            console.log('❌ No units returned (but no error)')
            console.log('   This suggests RLS is blocking access')
            console.log('\n🔧 SOLUTION:')
            console.log('   Run: fix-rls-policies.sql in Supabase dashboard')
            return
        }

        console.log(`✅ Found ${units.length} units:`)
        units.forEach(unit => {
            console.log(`   - ${unit.name} (${unit.type})`)
        })

        console.log('\n🎉 CONNECTION TEST PASSED!')
        console.log('Your database connection is working correctly.')

    } catch (error) {
        console.log('❌ Unexpected error:', error.message)
        console.log('\nThis might be a network or configuration issue.')
        console.log('Check your environment variables and internet connection.')
    }
}

testConnection()