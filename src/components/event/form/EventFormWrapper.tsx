
import { EventFormProps } from "../EventFormTypes";
import { EventFormContent } from "./EventFormContent";

export function EventFormWrapper(props: EventFormProps) {
  // Always give permission to edit events as admin
  return (
    <EventFormContent
      {...props}
      hasPermissionToEdit={true}
      user={{
        id: 'admin',
        username: 'admin',
        full_name: 'Administrator',
        avatar_url: null,
        email: 'admin@example.com',
        is_admin: true,
        is_approved: true,
        is_member: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        event_reminders_enabled: true,
        email_notifications: true,
        in_app_notifications: true,
        interests: null,
        leaderboard_opt_out: false
      }}
    />
  );
}
