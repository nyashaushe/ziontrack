// Quick fix - show just the data insertion SQL
// Run with: node quick-fix.js

const fs = require('fs')

console.log('🎯 QUICK FIX - Your tables exist, just need data!')
console.log('='.repeat(60))
console.log('')
console.log('📋 COPY THIS SQL AND RUN IT IN SUPABASE:')
console.log('')

try {
    const sqlContent = fs.readFileSync('insert-data-only.sql', 'utf8')
    console.log(sqlContent)
} catch (error) {
    console.log('❌ Could not read insert-data-only.sql:', error.message)
}

console.log('')
console.log('='.repeat(60))
console.log('')
console.log('🚀 STEPS:')
console.log('1. Copy the SQL above')
console.log('2. Go to https://supabase.com/dashboard')
console.log('3. Open project: fpwwlyekaepmctsndsqp')
console.log('4. SQL Editor → New Query')
console.log('5. Paste and Run')
console.log('')
console.log('✅ You should see:')
console.log('   Units inserted: 7')
console.log('   Sample entries: 4')
console.log('')
console.log('🔍 Then verify with: node verify-setup.js')