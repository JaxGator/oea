
import { EventFormProps } from "../EventFormTypes";
import { EventFormContent } from "./EventFormContent";

export function EventFormWrapper(props: EventFormProps) {
  return (
    <EventFormContent
      {...props}
      hasPermissionToEdit={true}
      user={null}
    />
  );
}
