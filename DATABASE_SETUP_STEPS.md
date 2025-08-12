# 📋 Database Setup Steps - Harare Zimbabwe South Stake

## 🎯 **Choose Your Setup Method**

### **Method 1: Simple Update (Recommended)**
If you've already run some schema before and getting policy errors:

1. **Run**: `supabase-harare-update.sql`
2. **This will**: Update existing schema safely for Harare Stake
3. **Result**: Clean setup with Harare units

### **Method 2: Check First, Then Update**
If you want to see what exists first:

1. **Run**: `supabase-check-existing.sql` (see what's already there)
2. **Then run**: `supabase-harare-update.sql` (safe update)

### **Method 3: Fresh Start**
If you want to start completely fresh:

1. **Go to**: Supabase Dashboard → SQL Editor
2. **Run**: `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`
3. **Then run**: `supabase-schema-incremental.sql`

## 🔧 **Recommended: Simple Update**

Since you're getting policy errors, use the simple update:

```sql
-- Copy and paste contents of supabase-harare-update.sql
-- This handles existing objects safely
```

## ✅ **Expected Results**

After running the update, you should have:

### **Tables Created**
- ✅ `profiles` (with unit_id, no stake field)
- ✅ `units` (7 Harare Zimbabwe South Stake units)
- ✅ `user_unit_roles` (for access control)

### **Units Available**
- Harare 1st Ward
- Harare 2nd Ward  
- Harare 3rd Ward
- Chitungwiza Ward
- Norton Ward
- Ruwa Ward
- Young Single Adult Branch

### **Policies Active**
- ✅ Row Level Security enabled
- ✅ Users can view own profile
- ✅ Stake leaders can view all profiles
- ✅ Unit-based access control

## 🚀 **Test the Setup**

After running the schema:

1. **Visit**: http://localhost:3000
2. **Click**: "Get Started" 
3. **Try signup**: Select different roles and units
4. **Verify**: Role-based access works correctly

## 🆘 **If You Still Get Errors**

If you continue getting policy errors:

1. **Check existing policies**:
   ```sql
   SELECT schemaname, tablename, policyname 
   FROM pg_policies 
   WHERE schemaname = 'public';
   ```

2. **Drop all policies manually**:
   ```sql
   DROP POLICY IF EXISTS "policy_name_here" ON table_name;
   ```

3. **Then run**: `supabase-harare-update.sql`

---

**The simple update script handles most edge cases and should work cleanly!**