// Simple test script to verify Supabase connection
// Run with: node test-supabase-connection.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://fpwwlyekaepmctsndsqp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwd3dseWVrYWVwbWN0c25kc3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODkxNjQsImV4cCI6MjA3MDU2NTE2NH0.h3hDkQFPXuh1GJ83fVXxPHXDl-U0JNQS8-JFNZnLyyQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
    console.log('Testing Supabase connection...')

    try {
        const { data, error } = await supabase
            .from('units')
            .select('id, name, type')
            .limit(3)

        if (error) {
            console.error('❌ Database error:', error.message)
            return
        }

        if (data && data.length > 0) {
            console.log('✅ Connection successful!')
            console.log('Sample units found:')
            data.forEach(unit => {
                console.log(`  - ${unit.name} (${unit.type})`)
            })
        } else {
            console.log('⚠️  Connection works but no units found. Run the SQL setup script.')
        }
    } catch (err) {
        console.error('❌ Connection failed:', err.message)
    }
}

testConnection()