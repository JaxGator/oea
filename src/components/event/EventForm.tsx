
import { EventFormProps } from "./EventFormTypes";
import { EventFormWrapper } from "./form/EventFormWrapper";

export function EventForm(props: EventFormProps) {
  return <EventFormWrapper {...props} />;
}
