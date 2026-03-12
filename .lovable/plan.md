

## Problem: Session Initialization Loop

### Root Cause

Three overlapping session management layers create an infinite re-mount loop:

1. **`AppProviders`** calls `getSession()` on mount
2. **`SessionManager`** calls `getSession()` again AND sets up `onAuthStateChange`
3. **`useSessionManager`** (called inside SessionManager) calls `getSession()` a THIRD time AND sets up a SECOND `onAuthStateChange`

The critical bug: both `useEffect` hooks include `location.pathname` in their dependency arrays. When the `SIGNED_IN` handler in `SessionManager` (line 114) calls `navigate('/')`, it changes `location.pathname`, which re-runs both effects, which create new subscriptions, which fire `INITIAL_SESSION` again — causing the infinite loop visible in the logs.

```text
SessionManager mounts
  → getSession() + onAuthStateChange listener #1
  → useSessionManager() → getSession() + onAuthStateChange listener #2
  → INITIAL_SESSION fires on both listeners
  → Listener #1 handles SIGNED_IN → navigate('/')
  → location.pathname changes → effects re-run
  → New listeners created → INITIAL_SESSION fires again
  → Loop repeats
```

### Plan

**1. Replace `SessionManager.tsx` with a simple, loop-free implementation**

- Call `getSession()` once to set `isInitialized`
- Set up ONE `onAuthStateChange` listener (remove `useSessionManager` call)
- Use `useRef` for location/navigate to keep them OUT of the dependency array
- Handle `INITIAL_SESSION` as a no-op (just mark ready)
- Only navigate to `/auth` on `SIGNED_OUT`, only navigate to `/` on `SIGNED_IN` if currently on `/auth`
- Remove `location.pathname` from deps entirely

**2. Simplify `useSessionManager.ts`** — delete or gut it

Since SessionManager will handle everything, `useSessionManager` becomes dead code. Remove the import and call from SessionManager.

**3. Simplify `AppProviders.tsx`**

Remove the redundant `getSession()` + loading state. SessionManager already gates rendering via `isInitialized`. This eliminates the triple session check.

### Files Changed

| File | Change |
|------|--------|
| `src/components/auth/SessionManager.tsx` | Rewrite: single `getSession` + single `onAuthStateChange`, stable deps, no loop |
| `src/hooks/useSessionManager.ts` | Delete or empty out — no longer used |
| `src/components/providers/AppProviders.tsx` | Remove redundant `getSession`/loading state; render SessionManager directly |

