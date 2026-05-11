## Problem

The Messages page fails to initialize Stream Chat. The `upsert-stream-user` edge function throws:

```
TypeError: serverClient.createUserToken is not a function
```

In `stream-chat` v8+, the server-side method is `createToken(userId)`, not `createUserToken`. The current code (`supabase/functions/upsert-stream-user/index.ts` line 45) calls a non-existent method, so every chat session fails with a non-2xx response.

## Fix

Rewrite `supabase/functions/upsert-stream-user/index.ts` to:

1. Generate the JWT manually via Web Crypto (HMAC-SHA256), matching the pattern already used in `generate-stream-token/index.ts`. This avoids the `stream-chat` SDK's Node-only signing path entirely and is the most reliable approach in Deno.
2. Upsert the user via Stream's REST API directly (`POST https://chat.stream-io-api.com/users` with the server-side JWT), wrapped in try/catch so a non-critical upsert failure doesn't block token return.
3. Keep the existing response shape `{ result: { token } }` so `StreamChatProvider.tsx` keeps working unchanged.
4. Preserve CORS headers and structured logging.

No frontend changes needed — `StreamChatProvider` already passes the right payload and reads `result.token`.

## Verification

After deploy, reload the Messages page and confirm:
- Edge function logs show successful token generation (no `createUserToken` error).
- `StreamChatProvider` reaches "Stream Chat initialized successfully".
- The chat UI renders the channel list and message input.
