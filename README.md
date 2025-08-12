# Overview

As a software engineer, I built ZionTrack to deepen my understanding of full-stack web development, cloud database integration, and role-based authentication systems. This project challenged me to implement complex user permission systems, server-side rendering, and robust error handling in a real-world application context.

ZionTrack is a comprehensive church leadership dashboard that integrates with Supabase (PostgreSQL) cloud database to provide role-based access control for church administrators. The application features three distinct user roles: Viewers (read-only access), Unit Leaders (manage specific church units), and Stake Leaders (full administrative access to all units). Users can authenticate securely, manage church units, view analytics, and access role-appropriate features through an intuitive dashboard interface.

The purpose of building this software was to master modern web development technologies including Next.js 15, TypeScript, and cloud database integration while implementing enterprise-level security features like Row Level Security (RLS) policies and server-side authentication. This project allowed me to explore advanced concepts such as middleware-based route protection, graceful error handling, and responsive UI design with Tailwind CSS and Radix UI components.

[Software Demo Video](http://youtube.link.goes.here)

# Cloud Database

I am using Supabase as my cloud database solution, which is built on PostgreSQL and provides real-time capabilities, authentication, and Row Level Security (RLS) policies. Supabase offers a complete backend-as-a-service platform that handles user authentication, database management, and API generation automatically.

The database structure consists of three main tables:
- **profiles** - Stores user profile information including roles (viewer, unit_leader, stake_leader), display names, and metadata. Each profile is linked to a Supabase auth user.
- **units** - Contains church organizational units (wards, branches, stakes) with details like unit names, numbers, types, and hierarchical relationships.
- **user_unit_roles** - A junction table that creates many-to-many relationships between users and units, defining which units each user can access based on their role permissions.

The database implements Row Level Security policies to ensure users can only access data appropriate to their role level, with Stake Leaders having full access, Unit Leaders accessing only their assigned units, and Viewers having read-only permissions to their designated units.

# Development Environment

I used Visual Studio Code as my primary development environment with extensions for TypeScript, React, and Tailwind CSS. The project was developed on Windows using Node.js 18+ and npm for package management. I utilized Git for version control and tested the application locally using Next.js development server.

The programming language used is TypeScript with React 18 and Next.js 15 framework. Key libraries include:
- **@supabase/supabase-js** and **@supabase/ssr** for cloud database integration and authentication
- **@radix-ui** component library for accessible UI components
- **tailwindcss** for utility-first CSS styling
- **react-hook-form** with **zod** for form validation
- **vitest** and **@testing-library/react** for unit testing
- **lucide-react** for icons and **recharts** for data visualization

# Useful Websites

- [Supabase Documentation](https://supabase.com/docs) - Comprehensive guide for database setup, authentication, and RLS policies
- [Next.js App Router Documentation](https://nextjs.org/docs/app) - Essential for understanding server-side rendering and route groups
- [Radix UI Components](https://www.radix-ui.com/primitives) - Accessible component library documentation and examples
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS framework reference
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Type system documentation for React development

# Future Work

- Implement real-time data synchronization using Supabase subscriptions for live dashboard updates
- Add comprehensive unit testing coverage for all authentication flows and role-based access scenarios
- Create mobile-responsive design improvements and consider developing a React Native companion app
- Integrate advanced analytics and reporting features with data visualization charts and export capabilities
- Implement audit logging system to track user actions and data changes for administrative oversight