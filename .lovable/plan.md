

# Comprehensive Feature Review

A systematic audit of every feature area, identifying issues that need fixing.

---

## 1. Authentication & Session Management

**Status: Has issues**

- **Dual auth listeners**: `useSession.ts` (line 91) sets up its own `onAuthStateChange` listener, AND `SessionManager.tsx` (line 48) sets up another. Both fire on every auth event, causing duplicate profile fetches and `queryClient.invalidateQueries()` calls. The loop is gone, but the redundancy wastes resources and can cause race conditions.
- **Fix**: Remove the `onAuthStateChange` listener from `useSession.ts`. It should only do the initial `getSession()` + profile fetch. Let `SessionManager` handle all auth state changes and invalidate queries (which will cause `useSession`'s React Query to refetch).

## 2. Admin Notifications

**Status: Broken — DELETE blocked by RLS**

- The `admin_notifications` table has **no DELETE RLS policy**. The code in `useNotifications.ts` calls `.delete()` on lines 70 and 97, but these will silently fail (Supabase returns no error for RLS-blocked deletes, just 0 rows affected).
- **Fix**: Add a DELETE policy for admins:
  ```sql
  CREATE POLICY "Allow admins to delete notifications"
  ON admin_notifications FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));
  ```

## 3. Admin Notifications — INSERT blocked for authenticated users

**Status: Broken for client-side inserts**

- The INSERT policy on `admin_notifications` only allows `service_role`. If any client-side code (e.g., `AuthForm.tsx`, `ContactAdminDialog.tsx`) tries to insert notifications, it will fail silently.
- **Fix**: Add an INSERT policy for authenticated admins, or ensure all inserts go through edge functions using the service role key.

## 4. Admin Panel Tabs (Users, Payments, Gallery, Config, Notifications, Reports, Testing)

**Status: Likely working** after the session loop fix, but the Notifications tab renders `AdminNotifications` which is a HoverCard (hover-triggered popup), not a full tab content panel. When clicked as a tab, it shows a bell icon hover card — this is probably not the intended UX for a full tab view.

## 5. Events Page

**Status: Has issues**

- `Events.tsx` hardcodes `isAuthenticated={true}` (lines 63, 74), bypassing actual auth checks. This means unauthenticated users see create/edit controls that will fail when they try to use them.
- **Fix**: Use the actual `isAuthenticated` value from `useAuthState()`.

## 6. Event Permissions

**Status: Working but redundant**

- Two parallel permission systems exist: `useAuthVerification.ts` (137 lines, makes direct Supabase calls) and `useEventPermissions.ts` (uses `PermissionService`). Both are used in different parts of the codebase. This creates inconsistency.
- **Recommendation**: Consolidate to one.

## 7. Profile Page

**Status: Working**

- Loads profile, allows editing username/full name/avatar/email/password/interests. Has proper auth guard.

## 8. Messages (Stream Chat)

**Status: Depends on Stream API key**

- Uses `StreamChatProvider` with Stream Chat SDK. Will work if `VITE_STREAM_API_KEY` secret is set and the Stream project is configured. No code-level issues visible.

## 9. Members Page (Polls, Reports, Guides, Merch)

**Status: Likely working**

- Polls use `handle_poll_vote` RPC which exists. Reports query events/RSVPs. No obvious issues.

## 10. Store Page

**Status: Working**

- Simple Printful iframe embed. No backend dependencies.

## 11. Resources Page

**Status: Working**

- Static data rendering from `resourcesData`.

## 12. About Page

**Status: Working**

- Loads content from `useAboutContent` hook, renders hero + activity types.

## 13. Home Page (Featured Events, Leaderboard, Gallery, Social Feed, Taco Tracker)

**Status: Partially working**

- `LeaderboardSection` and `SocialFeed` use `as any` type assertions for tables not in generated types. Queries should work at runtime if tables exist.
- `SocialFeed` queries `social_media_feeds` — this table exists in the DB but not in TypeScript types. Runtime should work.

## 14. Gallery Manager (Admin)

**Status: Working**

- Uses `gallery_images` table which is in the schema with proper RLS.

## 15. Payment Manager (Admin)

**Status: Working with type workaround**

- Uses `as any` for the joined query. The runtime query should return correct data; the earlier fix mapped `events[0]?.title` correctly.

## 16. Site Config (Admin)

**Status: Runtime depends on table existence**

- Queries `site_config` table with `as any`. If the table exists in the DB, it works. If not, queries fail silently.

## 17. Public Poll/Event Share Views

**Status: Working**

- Public routes with proper RLS policies allowing anonymous/public access.

---

## Summary of Required Fixes

| Priority | Issue | Fix |
|----------|-------|-----|
| **High** | Dual `onAuthStateChange` listeners (SessionManager + useSession) | Remove listener from `useSession.ts`, keep only in SessionManager |
| **High** | No DELETE RLS policy on `admin_notifications` | Add DELETE policy for admins via migration |
| **High** | No INSERT RLS policy for authenticated users on `admin_notifications` | Add INSERT policy for admins, or route all inserts through edge functions |
| **Medium** | `Events.tsx` hardcodes `isAuthenticated={true}` | Use actual auth state |
| **Low** | Redundant permission systems (`useAuthVerification` vs `useEventPermissions`) | Consolidate |
| **Low** | Admin Notifications tab renders a HoverCard instead of full content | Redesign as a proper tab panel |

### Files to Change

| File | Change |
|------|--------|
| `src/hooks/auth/useSession.ts` | Remove `onAuthStateChange` listener; keep only initial session fetch |
| DB migration | Add DELETE + INSERT policies for `admin_notifications` |
| `src/pages/Events.tsx` | Replace hardcoded `isAuthenticated={true}` with actual value |

