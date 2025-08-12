# Quick Start Guide - Zion Track

## 🚀 Get Running in 5 Minutes

### Step 1: Database Setup
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project (or select existing)
3. Go to **SQL Editor**
4. Copy and paste **ALL** contents from `supabase-schema-fixed.sql`
5. Click **Run** - this creates tables, policies, and sample data

### Step 2: Get Your Credentials
1. In Supabase, go to **Settings → API**
2. Copy your **Project URL** and **anon/public key**
3. Update your `.env` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
NODE_ENV=development
```

### Step 3: Run the App
```bash
npm install
npm run dev
```

### Step 4: Test It Out
1. Visit `http://localhost:3000`
2. Click "Get Started" to sign up
3. Choose a role (try "Stake Leader" for full access)
4. Complete signup and explore the dashboard

## ✅ Verification Checklist

After running the schema, verify in Supabase:
- [ ] **Table Editor** shows: `profiles`, `units`, `user_unit_roles` tables
- [ ] **Authentication → Users** is ready for signups
- [ ] Sample units exist in the `units` table

## 🔧 Troubleshooting

### "relation does not exist" error
- **Cause**: Schema wasn't run completely
- **Fix**: Run `supabase-schema-fixed.sql` again

### "Demo User" always shows
- **Cause**: Environment variables not set
- **Fix**: Check your `.env` file has correct Supabase credentials

### Can't sign up
- **Cause**: Email confirmation might be enabled
- **Fix**: In Supabase → Authentication → Settings, disable "Enable email confirmations"

### Wrong permissions after signup
- **Cause**: User needs to be assigned to units
- **Fix**: Go to Supabase → Table Editor → `user_unit_roles` and add entries

## 🎯 Quick Test Scenarios

### Test Role-Based Access
1. **Create Viewer Account**: Limited access, can only view assigned units
2. **Create Unit Leader Account**: Can manage their specific unit
3. **Create Stake Leader Account**: Full access + admin panel

### Test Demo Mode
1. Temporarily rename your `.env` file to `.env.backup`
2. Restart the app - should show "Demo User"
3. Rename back to `.env` - should work normally

## 📞 Need Help?

1. Check `SUPABASE_SETUP.md` for detailed instructions
2. Review `DEPLOYMENT_CHECKLIST.md` for production setup
3. Run tests: `npm run test:run` to verify everything works

---

**Pro Tip**: Start with a Stake Leader account to get full access and test all features!