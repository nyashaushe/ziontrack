import { vi } from 'vitest'

// Mock Next.js server functions
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

// Mock Supabase SSR
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}))
