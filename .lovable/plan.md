

## Plan: Restore Real Authentication

### Summary
Remove all hardcoded admin bypasses and restore proper session-based authentication across 4 files.

### Changes

**1. `src/hooks/useAuthState.tsx`** — Remove mock admin profile, use real session/profile data:
- Remove the `adminProfile` constant and `useEffect` log
- Return real data from `useSession()` and `useProfile()`:
  - `user: profile || null`
  - `profile: profile || null`
  - `isLoading: isSessionLoading || isProfileLoading`
  - `error: sessionError || profileError || null`
  - `isAuthenticated: !!authUser && !!profile`

**2. `src/hooks/events/useEventPermissions.ts`** — Restore real permission checking:
- Import `useAuthState` and `PermissionService`
- Use `useAuthState()` to get the current user
- In `checkPermissions`, call `PermissionService.canEditEvent()` with the real user, event's `created_by`, and the `forceAdmin`/`forceCanManage` overrides
- Default `hasValidPermission` to `false` instead of `true`

**3. `src/components/auth/RequireAdmin.tsx`** — Restore real admin gate:
- Use `useAdminCheck()` hook (already imported)
- Show `LoadingScreen` while loading
- Redirect to `/` with a toast if not admin
- Render children only if admin

**4. `src/components/event/form/EventFormWrapper.tsx`** — Use real auth instead of mock profile:
- Import `useAuthState` and `useEventPermissions`
- Get real `user`/`profile` from `useAuthState()`
- Get `hasValidPermission` from `useEventPermissions(props.initialData)`
- Pass real `user` and `hasPermissionToEdit` to `EventFormContent`
- Show loading state while auth is resolving

**5. `src/components/event/card/sections/actions/AdminActions.tsx`** — Remove forced `true` permissions:
- Replace hardcoded `effectiveIsAdmin = true` etc. with real checks using the `user` profile and utility functions (`isAdministrator`, `canManageEvents`, `canEditEvent`, `canDeleteEvent`)

### Technical Note
The `useAdminCheck` hook already derives `isAdmin` from the real profile via `useAuthState`, so once `useAuthState` is fixed, `RequireAdmin` and all admin checks will work correctly end-to-end.

