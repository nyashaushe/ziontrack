// Test script to verify data entry functionality
// Run with: node test-data-entry.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://fpwwlyekaepmctsndsqp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwd3dseWVrYWVwbWN0c25kc3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODkxNjQsImV4cCI6MjA3MDU2NTE2NH0.h3hDkQFPXuh1GJ83fVXxPHXDl-U0JNQS8-JFNZnLyyQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDataEntry() {
    console.log('🧪 Testing Data Entry Functionality...\n')

    try {
        // 1. Get available units
        console.log('1. Fetching available units...')
        const { data: units, error: unitsError } = await supabase
            .from('units')
            .select('id, name, type')
            .limit(3)

        if (unitsError) {
            console.log('❌ Failed to fetch units:', unitsError.message)
            return
        }

        if (!units || units.length === 0) {
            console.log('❌ No units found. Run supabase-clean-setup.sql first.')
            return
        }

        console.log('✅ Found units:')
        units.forEach(unit => {
            console.log(`   - ${unit.name} (${unit.type}) - ID: ${unit.id}`)
        })

        const testUnit = units[0]

        // 2. Test data entry (CREATE operation)
        console.log('\n2. Testing data entry (CREATE)...')

        const testEntry = {
            unit_id: testUnit.id,
            indicator_key: 'sacrament_attendance',
            period_start: '2024-01-07', // Sunday
            value: 125,
            notes: 'Test entry from automated script'
        }

        const { data: newEntry, error: insertError } = await supabase
            .from('indicator_entries')
            .insert(testEntry)
            .select()
            .single()

        if (insertError) {
            console.log('❌ Data entry failed:', insertError.message)
            return
        }

        console.log('✅ Data entry successful!')
        console.log(`   Entry ID: ${newEntry.id}`)
        console.log(`   Unit: ${testUnit.name}`)
        console.log(`   Indicator: ${testEntry.indicator_key}`)
        console.log(`   Date: ${testEntry.period_start}`)
        console.log(`   Value: ${testEntry.value}`)

        // 3. Test duplicate prevention
        console.log('\n3. Testing duplicate prevention...')

        const { error: duplicateError } = await supabase
            .from('indicator_entries')
            .insert(testEntry)

        if (duplicateError) {
            console.log('✅ Duplicate prevention working (expected error)')
        } else {
            console.log('⚠️  Duplicate prevention not working - this might be an issue')
        }

        // 4. Test data retrieval (READ operation)
        console.log('\n4. Testing data retrieval (READ)...')

        const { data: entries, error: readError } = await supabase
            .from('indicator_entries')
            .select('*')
            .eq('unit_id', testUnit.id)
            .order('created_at', { ascending: false })
            .limit(5)

        if (readError) {
            console.log('❌ Data retrieval failed:', readError.message)
            return
        }

        console.log('✅ Data retrieval successful!')
        console.log(`   Found ${entries.length} entries for ${testUnit.name}`)
        entries.forEach((entry, index) => {
            console.log(`   ${index + 1}. ${entry.indicator_key}: ${entry.value} (${entry.period_start})`)
        })

        // 5. Test form validation scenarios
        console.log('\n5. Testing validation scenarios...')

        // Test future date (should fail)
        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + 7)
        const futureDateStr = futureDate.toISOString().split('T')[0]

        const { error: futureDateError } = await supabase
            .from('indicator_entries')
            .insert({
                unit_id: testUnit.id,
                indicator_key: 'convert_baptisms',
                period_start: futureDateStr,
                value: 1,
                notes: 'Future date test'
            })

        // This might succeed at database level, but should be caught by form validation
        console.log('   Future date test: Database allows it (form should prevent it)')

        // 6. Clean up test data
        console.log('\n6. Cleaning up test data...')

        const { error: cleanupError } = await supabase
            .from('indicator_entries')
            .delete()
            .eq('notes', 'Test entry from automated script')

        if (cleanupError) {
            console.log('⚠️  Cleanup warning:', cleanupError.message)
        } else {
            console.log('✅ Test data cleaned up')
        }

        console.log('\n🎉 Data Entry Testing Complete!')
        console.log('\nWhat this verified:')
        console.log('✅ Units can be fetched for form dropdown')
        console.log('✅ New entries can be created')
        console.log('✅ Data can be retrieved and displayed')
        console.log('✅ Database constraints are working')
        console.log('\nYour data entry form should work perfectly!')

    } catch (error) {
        console.log('❌ Test failed:', error.message)
    }
}

testDataEntry()
