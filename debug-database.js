// Debug what's wrong with the database setup
// Run with: node debug-database.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://fpwwlyekaepmctsndsqp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwd3dseWVrYWVwbWN0c25kc3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODkxNjQsImV4cCI6MjA3MDU2NTE2NH0.h3hDkQFPXuh1GJ83fVXxPHXDl-U0JNQS8-JFNZnLyyQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugDatabase() {
    console.log('🔍 Debugging Database Setup...\n')

    try {
        // Check what tables exist
        console.log('1. Checking existing tables...')

        const { data: tables, error: tablesError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')

        if (tablesError) {
            console.log('❌ Cannot check tables:', tablesError.message)
        } else {
            console.log('✅ Found tables:')
            if (tables && tables.length > 0) {
                tables.forEach(table => {
                    console.log(`   - ${table.table_name}`)
                })
            } else {
                console.log('   (No tables found)')
            }
        }

        // Check specifically for our required tables
        console.log('\n2. Checking required tables...')
        const requiredTables = ['units', 'profiles', 'indicator_entries', 'user_unit_roles']

        for (const tableName of requiredTables) {
            try {
                const { data, error } = await supabase
                    .from(tableName)
                    .select('*')
                    .limit(1)

                if (error) {
                    console.log(`❌ ${tableName}: ${error.message}`)
                } else {
                    console.log(`✅ ${tableName}: Table exists (${data?.length || 0} sample records)`)
                }
            } catch (err) {
                console.log(`❌ ${tableName}: ${err.message}`)
            }
        }

        // Check units specifically
        console.log('\n3. Checking units table in detail...')
        try {
            const { data: units, error: unitsError } = await supabase
                .from('units')
                .select('*')

            if (unitsError) {
                console.log('❌ Units error:', unitsError.message)
                console.log('   This means the units table was not created properly')
            } else if (!units || units.length === 0) {
                console.log('⚠️  Units table exists but is empty')
                console.log('   The INSERT statements in the SQL script may have failed')
            } else {
                console.log('✅ Units table has data:')
                units.forEach(unit => {
                    console.log(`   - ${unit.name} (${unit.type}) - ID: ${unit.id}`)
                })
            }
        } catch (err) {
            console.log('❌ Units check failed:', err.message)
        }

        console.log('\n📋 DIAGNOSIS:')
        console.log('If you see errors above, it means the SQL script did not run successfully.')
        console.log('Common issues:')
        console.log('- SQL was not copied completely')
        console.log('- SQL Editor showed errors that were ignored')
        console.log('- Network issues during execution')
        console.log('')
        console.log('🔧 SOLUTION:')
        console.log('1. Run: node show-sql.js')
        console.log('2. Copy the ENTIRE SQL output')
        console.log('3. Go to Supabase dashboard and run it again')
        console.log('4. Make sure you see "DATABASE SETUP COMPLETE!" message')

    } catch (error) {
        console.log('❌ Debug failed:', error.message)
    }
}

debugDatabase()