
REVOKE EXECUTE ON FUNCTION public.create_event_reminder_notification() FROM anon, public, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_user_email() FROM anon, public, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_rsvp_cancellation() FROM anon, public, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_group_chat_creator() FROM anon, public, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, public, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_content_change() FROM anon, public, authenticated;
REVOKE EXECUTE ON FUNCTION public.create_message_notification() FROM anon, public, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_message_deletion() FROM anon, public, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_rsvp_status() FROM anon, public, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_leaderboard_on_rsvp() FROM anon, public, authenticated;
REVOKE EXECUTE ON FUNCTION public.prevent_profile_privilege_escalation() FROM anon, public, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_email_confirmation() FROM anon, public, authenticated;
REVOKE EXECUTE ON FUNCTION public.verify_admin_status() FROM anon, public, authenticated;
REVOKE EXECUTE ON FUNCTION public.import_wix_event(text, text, date, time, text, integer, uuid, text, timestamptz) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.import_wix_event(text, text, date, time, text, integer, uuid, text, integer, timestamptz) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.test_email_template(text, text, jsonb) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.update_leaderboard_metrics() FROM authenticated;
