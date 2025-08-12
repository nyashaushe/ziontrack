# Implementation Plan

- [x] 1. Fix the null pointer error in getSessionUser function





  - Modify the getSessionUser function in lib/auth.ts to properly handle null supabase client
  - Add null check before attempting to call supabase.auth.getUser()
  - Ensure the function returns null immediately when supabase client is unavailable
  - _Requirements: 1.1, 1.2_

- [x] 2. Add development logging for authentication state





  - Add optional console logging in getSessionUser to indicate when demo mode is active
  - Log when Supabase configuration is missing for debugging purposes
  - Ensure logging only occurs in development environment
  - _Requirements: 3.2, 3.4_

- [x] 3. Create unit tests for authentication error handling





  - Write test for getSessionUser with null supabase client
  - Write test to verify no auth methods are called when client is null
  - Write test to verify proper null return value
  - _Requirements: 1.1, 1.2, 3.1_

- [x] 4. Create integration tests for demo mode fallback





  - Write test for getCurrentUser with failed authentication
  - Write test to verify demo user fallback works correctly
  - Write test to verify demo user has viewer role and empty units array
  - _Requirements: 2.1, 2.2, 2.4_

- [x] 5. Test server-side rendering with missing configuration





  - Create test that simulates missing Supabase environment variables
  - Verify that layout component renders without throwing errors
  - Verify that sidebar state calculation works with demo user
  - _Requirements: 1.3, 1.4, 2.3_