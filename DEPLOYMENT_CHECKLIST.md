# Deployment Checklist for Zion Track

## ✅ Pre-Deployment Checklist

### 1. Environment Setup
- [ ] `.env` file configured with Supabase credentials
- [ ] Environment variables added to deployment platform
- [ ] `NODE_ENV=production` set for production deployment

### 2. Database Setup
- [ ] Supabase project created
- [ ] `supabase-schema.sql` executed in Supabase SQL Editor
- [ ] `scripts/setup-demo-data.sql` executed (optional)
- [ ] Row Level Security (RLS) policies verified
- [ ] Sample units created in `units` table

### 3. Authentication Configuration
- [ ] Email authentication enabled in Supabase
- [ ] Email confirmation settings configured
- [ ] Additional auth providers configured (Google, etc.) - optional
- [ ] Email templates customized - optional

### 4. Testing
- [ ] All tests passing: `npm run test:run`
- [ ] Manual testing of authentication flow
- [ ] Role-based access control verified
- [ ] Demo mode fallback tested (remove env vars temporarily)

### 5. Security Review
- [ ] Environment variables not committed to git
- [ ] `.env` in `.gitignore`
- [ ] RLS policies tested
- [ ] No sensitive data in client-side code

## 🚀 Deployment Steps

### Vercel Deployment
1. **Connect Repository**
   - Link GitHub repository to Vercel
   - Configure build settings (Next.js preset)

2. **Environment Variables**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   SUPABASE_URL=your_url
   SUPABASE_ANON_KEY=your_key
   NODE_ENV=production
   ```

3. **Deploy**
   - Trigger deployment
   - Verify build success
   - Test production URL

### Other Platforms
- **Netlify**: Similar process, add env vars in site settings
- **Railway**: Connect repo, add env vars, deploy
- **DigitalOcean**: Use App Platform with GitHub integration

## 🧪 Post-Deployment Testing

### 1. Authentication Flow
- [ ] Sign up with new account works
- [ ] Email verification works (if enabled)
- [ ] Sign in with existing account works
- [ ] Sign out works
- [ ] Profile creation automatic

### 2. Role-Based Access
- [ ] Viewer role: Limited access verified
- [ ] Unit Leader role: Unit management access verified
- [ ] Stake Leader role: Full access and admin panel verified

### 3. Dashboard Functionality
- [ ] Overview tab loads correctly
- [ ] Units tab shows appropriate units
- [ ] Reports tab accessible based on role
- [ ] Admin tab only visible to stake leaders
- [ ] Settings tab works

### 4. Error Handling
- [ ] Graceful handling of network errors
- [ ] Demo mode fallback works if Supabase unavailable
- [ ] Proper error messages displayed

## 🔧 Production Configuration

### Supabase Production Settings
- [ ] Email rate limiting configured
- [ ] Database connection limits set appropriately
- [ ] Backup schedule configured
- [ ] Monitoring alerts set up

### Performance Optimization
- [ ] Images optimized
- [ ] Bundle size analyzed
- [ ] Caching headers configured
- [ ] CDN configured (if applicable)

## 📊 Monitoring & Maintenance

### 1. Set Up Monitoring
- [ ] Vercel Analytics enabled
- [ ] Supabase monitoring dashboard reviewed
- [ ] Error tracking configured (Sentry, etc.) - optional

### 2. Regular Maintenance
- [ ] Database backups verified
- [ ] User feedback collection set up
- [ ] Update schedule planned
- [ ] Security patches monitoring

## 🆘 Troubleshooting Common Issues

### Authentication Issues
- **Problem**: Users can't sign up
- **Solution**: Check email settings in Supabase Auth

### Database Issues  
- **Problem**: "relation does not exist" errors
- **Solution**: Ensure schema SQL was executed completely

### Role Issues
- **Problem**: Users have wrong permissions
- **Solution**: Check `profiles` table and `user_unit_roles` assignments

### Demo Mode Issues
- **Problem**: App stuck in demo mode
- **Solution**: Verify environment variables are set correctly

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs

## 🎉 Go Live!

Once all items are checked:
1. Announce to your church leadership team
2. Provide training on role-based features
3. Set up user accounts and assign appropriate roles
4. Monitor usage and gather feedback

---

**Remember**: Start with a small group of test users before rolling out to the entire organization!