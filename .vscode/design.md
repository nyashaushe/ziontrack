# Design Document

## Overview

This design addresses the authentication error handling issue by implementing proper null checks and graceful fallbacks throughout the authentication layer. The solution focuses on preventing the TypeError that occurs when Supabase is not configured while maintaining the existing demo mode functionality.

## Architecture

The authentication system follows a layered approach:

1. **Supabase Client Layer** (`lib/supabase/server.ts`) - Returns null when not configured
2. **Authentication Layer** (`lib/auth.ts`) - Handles session management with null checks
3. **User Service Layer** (`lib/user-service.ts`) - Provides user data with fallbacks
4. **Application Layer** (`app/layout.tsx`) - Consumes user data safely

The key architectural change is adding proper null checking at the Authentication Layer to prevent cascading failures.

## Components and Interfaces

### Modified Components

#### `getSessionUser()` in `lib/auth.ts`
- **Current Issue**: Calls `supabase.auth.getUser()` when `supabase` is null
- **Solution**: Add null check before attempting to use supabase client
- **Return Type**: `Promise<SessionUser | null>` (unchanged)
- **Behavior**: Return null immediately if supabase client is null

#### Error Handling Pattern
\`\`\`typescript
// Before (causes error)
const supabase = getSupabaseServer()
if (!supabase) return null
const { data, error } = await supabase.auth.getUser() // Error: supabase is null

// After (safe)
const supabase = getSupabaseServer()
if (!supabase) return null
const { data, error } = await supabase.auth.getUser() // This line never executes when supabase is null
\`\`\`

### Unchanged Components

#### `getCurrentUser()` in `lib/user-service.ts`
- Already has proper fallback logic for null sessionUser
- Demo user fallback works correctly
- No changes needed

#### `getSupabaseServer()` in `lib/supabase/server.ts`
- Current null return behavior is correct
- No changes needed

## Data Models

No changes to existing data models are required. The current types remain valid:

- `SessionUser`: `{ id: string, email: string | null }`
- `CurrentUser`: `{ id: string, name: string, email: string | null, role: UserRole, units: { id: string }[] }`

## Error Handling

### Current Error Flow
1. `getSupabaseServer()` returns null (correct)
2. `getSessionUser()` receives null but still tries to use it (ERROR)
3. TypeError crashes the application

### Improved Error Flow
1. `getSupabaseServer()` returns null (unchanged)
2. `getSessionUser()` checks for null and returns null immediately (FIXED)
3. `getCurrentUser()` receives null and returns demo user (unchanged)
4. Application continues with demo mode (unchanged)

### Error Logging
- Add optional console logging in development mode to help developers understand when demo mode is active
- Log when Supabase configuration is missing for debugging purposes

## Testing Strategy

### Unit Tests
1. **Test `getSessionUser()` with null supabase client**
   - Verify it returns null without throwing errors
   - Verify it doesn't attempt to call auth methods

2. **Test `getCurrentUser()` with failed authentication**
   - Verify demo user fallback works correctly
   - Verify demo user has appropriate viewer role

3. **Test integration flow**
   - Verify complete auth flow works with missing configuration
   - Verify application renders successfully in demo mode

### Integration Tests
1. **Test server-side rendering**
   - Verify layout renders without authentication errors
   - Verify sidebar state calculation works with demo user

2. **Test environment scenarios**
   - Test with missing SUPABASE_URL
   - Test with missing SUPABASE_ANON_KEY
   - Test with both missing

### Manual Testing
1. **Development Environment**
   - Remove Supabase environment variables
   - Verify application starts and renders correctly
   - Verify demo mode functionality

2. **Production Simulation**
   - Test deployment scenarios where auth might be temporarily unavailable
   - Verify graceful degradation

## Implementation Notes

### Code Changes Required
- **Minimal Change**: Only one line needs modification in `getSessionUser()`
- **Backward Compatible**: No breaking changes to existing APIs
- **Safe**: Maintains existing demo mode behavior

### Development Experience
- Developers will see the application work in demo mode when Supabase isn't configured
- Clear separation between authentication failure and configuration issues
- Easier local development setup

### Performance Impact
- **Negligible**: Only adds one null check
- **Positive**: Prevents expensive error handling and crash recovery
- **Server-side**: Faster rendering when auth is unavailable
