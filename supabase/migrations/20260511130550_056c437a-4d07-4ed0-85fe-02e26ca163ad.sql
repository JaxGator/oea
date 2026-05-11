
REVOKE EXECUTE ON FUNCTION public.search_site(text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.can_message_user(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_user_voted(uuid, uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.handle_poll_vote(uuid, uuid, uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.mark_messages_as_read(uuid, uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.mark_message_as_read(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_update_user(uuid, uuid, text, text, text, boolean, boolean, boolean) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.test_email_template(text, text, jsonb) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.update_leaderboard_metrics() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.import_wix_event(text, text, date, time, text, integer, uuid, text, timestamptz) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.import_wix_event(text, text, date, time, text, integer, uuid, text, integer, timestamptz) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.create_profile(uuid, text, text, text, boolean) FROM anon, public;

GRANT EXECUTE ON FUNCTION public.search_site(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_message_user(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_user_voted(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_poll_vote(uuid, uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_messages_as_read(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_message_as_read(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_user(uuid, uuid, text, text, text, boolean, boolean, boolean) TO authenticated;
