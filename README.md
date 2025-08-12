# Zion Track - Church Leadership Dashboard

A comprehensive church leadership dashboard with role-based access control, built with Next.js, Supabase, and TypeScript.

## 🚀 Features

### Role-Based Access Control
- **Viewer**: Read-only access to assigned units
- **Unit Leader**: Full access to manage their specific unit (Ward/Branch leadership)
- **Stake Leader**: Comprehensive access to all units in the stake with admin capabilities

### Authentication & Security
- Secure authentication with Supabase
- Row Level Security (RLS) policies
- Graceful fallback to demo mode when authentication is unavailable
- Server-side rendering with missing configuration handling

### Dashboard Features
- **Overview**: Key spiritual indicators and recent activity
- **Units Management**: View and manage accessible church units
- **Reports**: Generate role-appropriate reports and analytics
- **Admin Panel**: User management (Stake Leaders only)
- **Settings**: Account management and preferences

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI**: Tailwind CSS, Radix UI components
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Testing**: Vitest, Testing Library

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <your-repo>
cd ziontrack
npm install
```

### 2. Environment Setup
Create a `.env` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=development
```

### 3. Database Setup
1. Go to your Supabase dashboard → SQL Editor
2. Run the contents of `supabase-schema.sql` to create tables and policies
3. Optionally run `scripts/setup-demo-data.sql` for sample data

### 4. Run the Application
```bash
npm run dev
```

Visit `http://localhost:3000` to see the landing page.

## 📖 Detailed Setup Guide

See `SUPABASE_SETUP.md` for comprehensive setup instructions including:
- Database schema creation
- Authentication provider configuration
- User role management
- Security policies

## 🧪 Testing

Run the test suite:
```bash
npm run test        # Watch mode
npm run test:run    # Single run
```

Tests include:
- Authentication error handling
- Server-side rendering with missing configuration
- User service functionality
- Role-based access control

## 🏗️ Architecture

### Database Schema
- `profiles` - User profiles with roles and metadata
- `units` - Church units (wards, branches, stakes)
- `user_unit_roles` - Many-to-many relationship for user-unit access

### Authentication Flow
1. Users sign up with email/password and select their church role
2. Profile is automatically created with role-based permissions
3. Middleware handles authentication redirects
4. Graceful fallback to demo mode if Supabase is unavailable

### Role-Based Access
- **Viewer**: Can view assigned units only
- **Unit Leader**: Can manage their specific unit's data
- **Stake Leader**: Can access all units and manage users

## 🔐 Security Features

- Row Level Security (RLS) policies ensure data isolation
- Server-side authentication validation
- Secure cookie handling
- Environment variable validation
- Graceful error handling

## 📱 User Experience

### Landing Page
- Role-based feature explanations
- Secure authentication modal
- Responsive design

### Dashboard
- Role-appropriate navigation
- Real-time data updates
- Intuitive unit management
- Comprehensive reporting

### Admin Panel (Stake Leaders Only)
- User management interface
- Role assignment tools
- Permission reference guide

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
The app works on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the `SUPABASE_SETUP.md` guide
2. Review the test files for usage examples
3. Open an issue on GitHub

## 🎯 Roadmap

- [ ] Mobile app support
- [ ] Advanced reporting and analytics
- [ ] Integration with church systems
- [ ] Multi-language support
- [ ] Offline functionality

---

Built with ❤️ for church leadership everywhere.