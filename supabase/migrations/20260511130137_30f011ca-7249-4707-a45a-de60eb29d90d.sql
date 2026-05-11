
-- Fix 1: group_chat_messages - drop broken self-referential INSERT policy (duplicate of correct insert_messages_if_in_group)
DROP POLICY IF EXISTS "Participants can send messages to their group chats" ON public.group_chat_messages;

-- Fix 2: group_chat_participants - drop tautological SELECT policy (allow_group_chat_access ALL policy already provides scoped SELECT)
DROP POLICY IF EXISTS "Users can view participants of their groups" ON public.group_chat_participants;
-- Also drop enable_participants_for_users which has USING(true) for ALL ops
DROP POLICY IF EXISTS "enable_participants_for_users" ON public.group_chat_participants;

-- Fix 3: group_chats - drop overly permissive USING(true) ALL policy
DROP POLICY IF EXISTS "group_chats_access" ON public.group_chats;

-- Fix 4: event_rsvps - replace USING(true) SELECT policies with scoped policy
DROP POLICY IF EXISTS "Allow users to read RSVPs" ON public.event_rsvps;
DROP POLICY IF EXISTS "event_rsvps_select_policy" ON public.event_rsvps;
CREATE POLICY "event_rsvps_select_own_or_admin"
ON public.event_rsvps
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  OR EXISTS (SELECT 1 FROM public.events WHERE events.id = event_rsvps.event_id AND events.created_by = auth.uid())
);

-- Fix 5: poll_votes - drop policy exposing user_id to anonymous public for any active poll with share_token
DROP POLICY IF EXISTS "Anyone can view votes for shared polls" ON public.poll_votes;
-- Also drop the authenticated USING(true) policy that exposes all votes
DROP POLICY IF EXISTS "users can view poll votes" ON public.poll_votes;

-- Fix 6: leaderboard_metrics - drop USING/WITH CHECK true ALL policy
DROP POLICY IF EXISTS "System can update leaderboard metrics" ON public.leaderboard_metrics;
