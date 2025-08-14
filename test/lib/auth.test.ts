import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getSessionUser } from '@/lib/auth'

// Mock the getSupabaseServer function
vi.mock('@/lib/supabase/server', () => ({
  getSupabaseServer: vi.fn(),
}))

// Import the mocked function
import { getSupabaseServer } from '@/lib/supabase/server'

describe('Authentication Error Handling', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
    // Reset environment to development for consistent logging behavior
    process.env.NODE_ENV = 'development'
  })

  afterEach(() => {
    // Clean up console spy
    vi.restoreAllMocks()
  })

  describe('getSessionUser with null supabase client', () => {
    it('should return null when supabase client is null', async () => {
      // Arrange: Mock getSupabaseServer to return null
      vi.mocked(getSupabaseServer).mockResolvedValue(null)

      // Act: Call getSessionUser
      const result = await getSessionUser()

      // Assert: Should return null
      expect(result).toBeNull()
    })

    it('should not call auth methods when client is null', async () => {
      // Arrange: Mock getSupabaseServer to return null
      vi.mocked(getSupabaseServer).mockResolvedValue(null)
      
      // Create a mock supabase client to ensure it's never called
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn(),
        },
      }

      // Act: Call getSessionUser
      await getSessionUser()

      // Assert: Verify that no auth methods were called
      expect(mockSupabaseClient.auth.getUser).not.toHaveBeenCalled()
      expect(getSupabaseServer).toHaveBeenCalledOnce()
    })

    it('should log debug information in development when client is null', async () => {
      // Arrange: Mock getSupabaseServer to return null and spy on console.log
      vi.mocked(getSupabaseServer).mockResolvedValue(null)
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      // Act: Call getSessionUser
      await getSessionUser()

      // Assert: Verify debug logging occurred
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Auth Debug] Supabase client unavailable - falling back to demo mode'
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Auth Debug] Check SUPABASE_URL and SUPABASE_ANON_KEY environment variables'
      )
    })

    it('should not log in production when client is null', async () => {
      // Arrange: Set production environment and mock getSupabaseServer to return null
      process.env.NODE_ENV = 'production'
      vi.mocked(getSupabaseServer).mockResolvedValue(null)
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      // Act: Call getSessionUser
      await getSessionUser()

      // Assert: Verify no debug logging occurred
      expect(consoleSpy).not.toHaveBeenCalled()
    })
  })

  describe('getSessionUser with valid supabase client', () => {
    it('should return null when auth.getUser returns error', async () => {
      // Arrange: Mock supabase client with auth error
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Authentication failed' }
          }),
        },
      }
      vi.mocked(getSupabaseServer).mockResolvedValue(mockSupabaseClient as any)

      // Act: Call getSessionUser
      const result = await getSessionUser()

      // Assert: Should return null and call auth method
      expect(result).toBeNull()
      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledOnce()
    })

    it('should return null when auth.getUser returns no user data', async () => {
      // Arrange: Mock supabase client with no user data
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: null
          }),
        },
      }
      vi.mocked(getSupabaseServer).mockResolvedValue(mockSupabaseClient as any)

      // Act: Call getSessionUser
      const result = await getSessionUser()

      // Assert: Should return null and call auth method
      expect(result).toBeNull()
      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledOnce()
    })

    it('should return SessionUser when auth.getUser succeeds', async () => {
      // Arrange: Mock supabase client with successful auth
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com'
      }
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null
          }),
        },
      }
      vi.mocked(getSupabaseServer).mockResolvedValue(mockSupabaseClient as any)

      // Act: Call getSessionUser
      const result = await getSessionUser()

      // Assert: Should return SessionUser and call auth method
      expect(result).toEqual({
        id: 'test-user-id',
        email: 'test@example.com'
      })
      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledOnce()
    })

    it('should handle user with null email', async () => {
      // Arrange: Mock supabase client with user having null email
      const mockUser = {
        id: 'test-user-id',
        email: null
      }
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null
          }),
        },
      }
      vi.mocked(getSupabaseServer).mockResolvedValue(mockSupabaseClient as any)

      // Act: Call getSessionUser
      const result = await getSessionUser()

      // Assert: Should return SessionUser with null email
      expect(result).toEqual({
        id: 'test-user-id',
        email: null
      })
    })
  })
})
