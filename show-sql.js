// Show the exact SQL to copy and paste
// Run with: node show-sql.js

const fs = require('fs')

console.log('📋 EXACT SQL TO COPY AND PASTE:')
console.log('='.repeat(80))
console.log('')

try {
    const sqlContent = fs.readFileSync('supabase-clean-setup.sql', 'utf8')
    console.log(sqlContent)
} catch (error) {
    console.log('❌ Could not read supabase-clean-setup.sql:', error.message)
    process.exit(1)
}

console.log('')
console.log('='.repeat(80))
console.log('')
console.log('🎯 INSTRUCTIONS:')
console.log('1. Select ALL the text above (Ctrl+A)')
console.log('2. Copy it (Ctrl+C)')
console.log('3. Go to https://supabase.com/dashboard')
console.log('4. Open your project: fpwwlyekaepmctsndsqp')
console.log('5. Click "SQL Editor" in sidebar')
console.log('6. Click "New Query"')
console.log('7. Paste the SQL (Ctrl+V)')
console.log('8. Click "Run" button')
console.log('')
console.log('✅ You should see success messages ending with:')
console.log('   "✅ DATABASE SETUP COMPLETE!"')
console.log('')
console.log('🔍 After running, verify with: node verify-setup.js')