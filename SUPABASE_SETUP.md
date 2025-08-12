# Supabase Setup Guide for Zion Track

## 1. Database Schema Setup

### Step 1: Run the SQL Schema
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** in the left sidebar
4. Copy and paste the contents of `supabase-schema-fixed.sql` into the editor
5. Click **Run** to execute the schema

**Important**: Use `supabase-schema-fixed.sql` which has corrected syntax and includes sample data

This will create:
- `profiles` table (user profiles with roles)
- `units` table (church units/wards)
- `user_unit_roles` table (many-to-many relationship)
- Row Level Security policies
- Automatic profile creation trigger

### Step 2: Verify Tables
1. Go to **Table Editor** in the left sidebar
2. You should see the new tables: `profiles`, `units`, `user_unit_roles`

## 2. Authentication Setup

### Step 1: Enable Email Authentication
1. Go to **Authentication → Providers** in your Supabase dashboard
2. Make sure **Email** is enabled (it should be by default)
3. Configure email settings if needed

### Step 2: Optional - Enable Additional Providers
You can enable additional authentication providers:

#### Google OAuth (Recommended)
1. Go to **Authentication → Providers**
2. Click on **Google**
3. Enable the provider
4. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
   - (Get these from Google Cloud Console)

#### Other Providers
- **GitHub**: Good for developer-focused apps
- **Microsoft**: Good for enterprise environments
- **Apple**: Required for iOS apps

### Step 3: Configure Email Templates (Optional)
1. Go to **Authentication → Email Templates**
2. Customize the confirmation and password reset emails
3. Update the redirect URLs to match your domain

## 3. Row Level Security (RLS) Policies

The schema includes these security policies:

### Profiles
- Users can view and update their own profile
- Stake leaders can view all profiles in their stake

### Units
- Users can view units they have access to
- Stake leaders can view all units

### User Unit Roles
- Users can view their own unit roles
- Stake leaders can view all unit roles

## 4. Testing Your Setup

### Test Authentication
1. Run your app: `npm run dev`
2. Try to sign up with a new email
3. Check the `profiles` table - a new profile should be created automatically

### Test Demo Mode
1. Comment out your Supabase environment variables in `.env`
2. Restart your app
3. It should run in demo mode with a "Demo User"

## 5. Managing Users and Roles

### Assign Roles
1. Go to **Table Editor → profiles**
2. Find a user and edit their `role` field
3. Options: `viewer`, `unit-leader`, `stake-leader`

### Assign Units (Easy Method)
1. Go to **SQL Editor**
2. Use the helper functions:
   ```sql
   -- Assign user to all units (for stake leaders)
   SELECT assign_user_to_all_units('user-id-here', 'stake-leader');
   
   -- Assign user to specific unit (for unit leaders)
   SELECT assign_user_to_unit('user-id-here', 'unit-id-here', 'unit-leader');
   ```

### Assign Units (Manual Method)
1. Go to **Table Editor → user_unit_roles**
2. Create new rows to assign users to units
3. Set `user_id`, `unit_id`, and `role`

### Create Units
1. Go to **Table Editor → units**
2. Add new church units/wards
3. Include `name`, `unit_number`, and `type`

### Demo Data Setup (Optional)
1. **Only run this AFTER the main schema is complete**
2. Run the contents of `scripts/setup-demo-data.sql` in your SQL Editor
3. This creates additional helper functions for user management

**Note**: The main schema already includes sample units, so this step is optional

## 6. Environment Variables Checklist

Make sure your `.env` file has:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## 7. Security Considerations

- ✅ Row Level Security is enabled
- ✅ Users can only access their own data by default
- ✅ Stake leaders have broader access within their stake
- ✅ Anonymous key is safe for client-side use
- ⚠️ Keep your service role key private (not in `.env`)

## Troubleshooting

### Common Issues
1. **"relation does not exist"** - Run the schema SQL
2. **"permission denied"** - Check RLS policies
3. **"Demo User" always shows** - Check environment variables
4. **Email not sending** - Configure SMTP in Authentication settings

### Debug Mode
Your app includes debug logging. Check the console for authentication status messages.