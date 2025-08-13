// ZionTrack Database Setup Helper
// Run with: node run-sql-setup.js

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabaseUrl = 'https://fpwwlyekaepmctsndsqp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwd3dseWVrYWVwbWN0c25kc3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODkxNjQsImV4cCI6MjA3MDU2NTE2NH0.h3hDkQFPXuh1GJ83fVXxPHXDl-U0JNQS8-JFNZnLyyQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function showSetupInstructions() {
    console.log('🚀 ZionTrack Database Setup Helper\n')
    console.log('⚠️  IMPORTANT: Supabase client cannot execute DDL statements for security.')
    console.log('   You need to run the SQL in the Supabase dashboard manually.\n')

    try {
        // Check if SQL file exists
        if (!fs.existsSync('supabase-clean-setup.sql')) {
            console.log('❌ supabase-clean-setup.sql file not found')
            console.log('   Make sure you are running this from the project root directory')
            return
        }

        console.log('📋 STEP-BY-STEP SETUP INSTRUCTIONS:')
        console.log('='.repeat(50))
        console.log('')
        console.log('1. 🌐 Open your browser and go to:')
        console.log('   https://supabase.com/dashboard')
        console.log('')
        console.log('2. 🏢 Select your project:')
        console.log('   fpwwlyekaepmctsndsqp')
        console.log('')
        console.log('3. 📝 Go to SQL Editor:')
        console.log('   Click "SQL Editor" in the left sidebar')
        console.log('')
        console.log('4. ➕ Create New Query:')
        console.log('   Click "New Query" button')
        console.log('')
        console.log('5. 📄 Copy the SQL:')
        console.log('   Copy ALL the content from supabase-clean-setup.sql')
        console.log('   (The file is ready in your project directory)')
        console.log('')
        console.log('6. 📋 Paste and Run:')
        console.log('   Paste the SQL into the editor')
        console.log('   Click the "Run" button (▶️)')
        console.log('')
        console.log('7. ✅ Verify Success:')
        console.log('   You should see success messages')
        console.log('   Look for "Database setup complete!" message')
        console.log('')
        console.log('='.repeat(50))

        // Check current database state
        console.log('\n🔍 Checking current database state...')

        const { data: units, error: unitsError } = await supabase
            .from('units')
            .select('id, name, type')
            .limit(3)

        if (unitsError) {
            console.log('❌ Database not set up yet')
            console.log(`   Error: ${unitsError.message}`)
            console.log('   👆 Follow the steps above to set up your database')
        } else if (units && units.length > 0) {
            console.log('✅ Database already set up!')
            console.log('   Found units:')
            units.forEach(unit => {
                console.log(`   - ${unit.name} (${unit.type})`)
            })
            console.log('\n🎉 Your database is ready!')
            console.log('   Run: npm run dev')
            console.log('   Visit: http://localhost:3000/data-entry')
        } else {
            console.log('⚠️  Database exists but no units found')
            console.log('   You may need to run the setup SQL')
        }

    } catch (error) {
        console.log('❌ Error checking database:', error.message)
        console.log('   Please follow the manual setup steps above')
    }
}

// Show the SQL content for manual execution
function showSqlForManualExecution() {
    console.log('\n📋 SQL Content for Manual Execution:')
    console.log('='.repeat(60))

    try {
        const sqlContent = fs.readFileSync('supabase-clean-setup.sql', 'utf8')
        console.log(sqlContent)
        console.log('='.repeat(60))
        console.log('\n📝 Instructions:')
        console.log('1. Copy the SQL above')
        console.log('2. Go to https://supabase.com/dashboard')
        console.log('3. Open your project')
        console.log('4. Go to SQL Editor')
        console.log('5. Paste and run the SQL')
    } catch (error) {
        console.log('❌ Could not read SQL file:', error.message)
    }
}

// Check command line arguments
const args = process.argv.slice(2)
if (args.includes('--show-sql')) {
    showSqlForManualExecution()
} else {
    showSetupInstructions()
}