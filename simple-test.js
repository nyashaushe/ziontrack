// Simple test to check if data was inserted
// Run with: node simple-test.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://fpwwlyekaepmctsndsqp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwd3dseWVrYWVwbWN0c25kc3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODkxNjQsImV4cCI6MjA3MDU2NTE2NH0.h3hDkQFPXuh1GJ83fVXxPHXDl-U0JNQS8-JFNZnLyyQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function simpleTest() {
    console.log('🧪 Simple Database Test\n')

    try {
        // Test 1: Check units
        console.log('1. Checking units...')
        const { data: units, error: unitsError } = await supabase
            .from('units')
            .select('id, name, type')

        if (unitsError) {
            console.log('❌ Units error:', unitsError.message)
            return
        }

        if (!units || units.length === 0) {
            console.log('❌ No units found')
            console.log('   You need to run the insert-data-only.sql script')
            console.log('   Run: node quick-fix.js for instructions')
            return
        }

        console.log(`✅ Found ${units.length} units:`)
        units.forEach(unit => {
            console.log(`   - ${unit.name} (${unit.type})`)
        })

        // Test 2: Try to insert a test entry
        console.log('\n2. Testing data insertion...')
        const testUnitId = units[0].id

        const { data: newEntry, error: insertError } = await supabase
            .from('indicator_entries')
            .insert({
                unit_id: testUnitId,
                indicator_key: 'test_simple',
                period_start: '2024-01-01',
                value: 100,
                notes: 'Simple test entry'
            })
            .select()
            .single()

        if (insertError) {
            console.log('❌ Insert failed:', insertError.message)
            return
        }

        console.log('✅ Insert successful!')
        console.log(`   Entry ID: ${newEntry.id}`)

        // Test 3: Read the entry back
        console.log('\n3. Testing data retrieval...')
        const { data: entries, error: readError } = await supabase
            .from('indicator_entries')
            .select('*')
            .eq('id', newEntry.id)

        if (readError) {
            console.log('❌ Read failed:', readError.message)
            return
        }

        console.log('✅ Read successful!')
        console.log(`   Found entry: ${entries[0].indicator_key} = ${entries[0].value}`)

        // Test 4: Update the entry
        console.log('\n4. Testing data update...')
        const { error: updateError } = await supabase
            .from('indicator_entries')
            .update({ value: 200, notes: 'Updated test entry' })
            .eq('id', newEntry.id)

        if (updateError) {
            console.log('❌ Update failed:', updateError.message)
            return
        }

        console.log('✅ Update successful!')

        // Test 5: Delete the entry
        console.log('\n5. Testing data deletion...')
        const { error: deleteError } = await supabase
            .from('indicator_entries')
            .delete()
            .eq('id', newEntry.id)

        if (deleteError) {
            console.log('❌ Delete failed:', deleteError.message)
            return
        }

        console.log('✅ Delete successful!')

        console.log('\n🎉 ALL TESTS PASSED!')
        console.log('Your database is working perfectly!')
        console.log('\n🚀 Next steps:')
        console.log('1. Run: npm run dev')
        console.log('2. Visit: http://localhost:3000/data-entry')
        console.log('3. Test the form and CRUD operations')

    } catch (error) {
        console.log('❌ Test failed:', error.message)
        console.log('\nIf you see permission errors, make sure you ran the insert-data-only.sql script')
    }
}

simpleTest()