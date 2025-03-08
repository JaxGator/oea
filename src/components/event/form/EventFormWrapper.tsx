
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
        is_admin: true,
        is_approved: true,
        is_member: true
      }}
    />
  );
}
