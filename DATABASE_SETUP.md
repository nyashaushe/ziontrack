# 🗄️ ZionTrack Database Setup Guide

## 📋 **Step-by-Step Supabase Setup**

### **1. Create Supabase Account & Project**

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up** or **Sign in** with GitHub/Google
3. **Click "New Project"**
4. **Fill in project details:**
   - **Name**: `ziontrack` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location
5. **Click "Create new project"**
6. **Wait 2-3 minutes** for project to initialize

### **2. Get Your Environment Variables**

1. **In your Supabase dashboard**, go to **Settings** → **API**
2. **Copy these values:**
   - **Project URL** (starts with `https://`)
   - **anon public key** (starts with `eyJ`)

3. **Create `.env.local` file** in your project root:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_URL=your_project_url_here
SUPABASE_ANON_KEY=your_anon_key_here
NODE_ENV=development
\`\`\`

### **3. Set Up Database Tables**

1. **In Supabase dashboard**, go to **SQL Editor**
2. **Click "New Query"**
3. **Copy and paste** the following SQL scripts **one at a time**:

#### **Script 1: Create Tables and Basic Data**
\`\`\`sql
-- Create Units table
CREATE TABLE IF NOT EXISTS units (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('ward','branch')) NOT NULL,
  stake TEXT NOT NULL
);

-- Create Indicator Entries table
CREATE TABLE IF NOT EXISTS indicator_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id TEXT REFERENCES units(id) NOT NULL,
  indicator_key TEXT NOT NULL,
  period_start DATE NOT NULL,
  value INTEGER NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert sample units (Harare Zimbabwe South Stake)
INSERT INTO units (id, name, type, stake) VALUES
('harare1-ward', 'Harare 1st Ward', 'ward', 'Harare Zimbabwe South Stake'),
('harare2-ward', 'Harare 2nd Ward', 'ward', 'Harare Zimbabwe South Stake'),
('harare3-ward', 'Harare 3rd Ward', 'ward', 'Harare Zimbabwe South Stake'),
('chitungwiza-ward', 'Chitungwiza Ward', 'ward', 'Harare Zimbabwe South Stake'),
('norton-ward', 'Norton Ward', 'ward', 'Harare Zimbabwe South Stake'),
('ruwa-ward', 'Ruwa Ward', 'ward', 'Harare Zimbabwe South Stake'),
('ysa-branch', 'Young Single Adult Branch', 'branch', 'Harare Zimbabwe South Stake')
ON CONFLICT (id) DO NOTHING;
\`\`\`

4. **Click "Run"** to execute Script 1

#### **Script 2: Create User Profiles and Permissions**
\`\`\`sql
-- Create Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT CHECK (role IN ('stake_leader','unit_leader','viewer')) NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create User-Unit Roles junction table
CREATE TABLE IF NOT EXISTS user_unit_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  unit_id TEXT REFERENCES units(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('stake_leader','unit_leader','viewer')) NOT NULL,
  PRIMARY KEY (user_id, unit_id)
);

-- Helper function to check if user is stake leader
CREATE OR REPLACE FUNCTION is_stake_leader(uid UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
  SELECT EXISTS(SELECT 1 FROM profiles p WHERE p.id = uid AND p.role = 'stake_leader')
$$;

-- Helper function to check unit access
CREATE OR REPLACE FUNCTION user_has_unit_access(uid UUID, target_unit TEXT)
RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
  SELECT is_stake_leader(uid)
  OR EXISTS(SELECT 1 FROM user_unit_roles r WHERE r.user_id = uid AND r.unit_id = target_unit)
$$;
\`\`\`

5. **Click "Run"** to execute Script 2

#### **Script 3: Set Up Row Level Security (RLS)**
\`\`\`sql
-- Enable RLS on all tables
ALTER TABLE indicator_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_unit_roles ENABLE ROW LEVEL SECURITY;

-- Policies for indicator_entries
CREATE POLICY "Users can read entries for their units" ON indicator_entries
FOR SELECT TO authenticated
USING (user_has_unit_access(auth.uid(), unit_id));

CREATE POLICY "Users can insert entries for their units" ON indicator_entries
FOR INSERT TO authenticated
WITH CHECK (user_has_unit_access(auth.uid(), unit_id));

CREATE POLICY "Users can update entries for their units" ON indicator_entries
FOR UPDATE TO authenticated
USING (user_has_unit_access(auth.uid(), unit_id) OR auth.uid() = created_by)
WITH CHECK (user_has_unit_access(auth.uid(), unit_id) OR auth.uid() = created_by);

CREATE POLICY "Users can delete entries for their units" ON indicator_entries
FOR DELETE TO authenticated
USING (user_has_unit_access(auth.uid(), unit_id) OR auth.uid() = created_by);

-- Policies for profiles
CREATE POLICY "Users can read all profiles" ON profiles
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id);

-- Policies for user_unit_roles
CREATE POLICY "Users can read unit roles" ON user_unit_roles
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Stake leaders can manage unit roles" ON user_unit_roles
FOR ALL TO authenticated
USING (is_stake_leader(auth.uid()));
\`\`\`

6. **Click "Run"** to execute Script 3

### **4. Enable Realtime (Optional)**

1. **Go to Database** → **Replication**
2. **Find `indicator_entries` table**
3. **Toggle "Enable"** for realtime updates
4. **Click "Save"**

### **5. Configure Authentication**

1. **Go to Authentication** → **Settings**
2. **Under "User Signups":**
   - ✅ **Enable email confirmations** (recommended)
   - ✅ **Enable email change confirmations**
3. **Under "Auth Providers":**
   - ✅ **Email** should be enabled by default
4. **Click "Save"**

### **6. Test Your Setup**

1. **Restart your Next.js development server:**
\`\`\`bash
npm run dev
\`\`\`

2. **Visit** `http://localhost:3000`
3. **Try signing up** with a test account
4. **Check if the dashboard loads** without database errors

---

## 🔧 **Troubleshooting**

### **Common Issues:**

#### **"Database not configured" Error**
- ✅ Check your `.env.local` file has correct values
- ✅ Restart your development server after adding env vars
- ✅ Make sure env vars don't have extra spaces

#### **"Permission denied" Errors**
- ✅ Make sure you ran all 3 SQL scripts
- ✅ Check that RLS policies are created
- ✅ Verify your user has the correct role in the `profiles` table

#### **"Table doesn't exist" Errors**
- ✅ Run Script 1 again to create tables
- ✅ Check the SQL Editor for any error messages
- ✅ Make sure you're in the correct Supabase project

### **Verify Database Setup:**

Run this query in Supabase SQL Editor to check your tables:
\`\`\`sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('units', 'indicator_entries', 'profiles', 'user_unit_roles');

-- Check sample data
SELECT * FROM units LIMIT 5;
\`\`\`

---

## 🎯 **Next Steps**

Once your database is set up:

1. **Create a test user account** through your app
2. **Add some indicator entries** using the Data Entry form
3. **Test UPDATE/DELETE** operations in the Indicator Management section
4. **Watch real-time notifications** when data changes

Your ZionTrack application will now have full CRUD operations with a real cloud database!

---

## 📞 **Need Help?**

If you encounter issues:
1. Check the browser console for error messages
2. Check the Supabase dashboard logs
3. Verify your environment variables are correct
4. Make sure all SQL scripts ran successfully
