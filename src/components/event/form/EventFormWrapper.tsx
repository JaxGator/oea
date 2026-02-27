
import { EventFormProps } from "../EventFormTypes";
import { EventFormContent } from "./EventFormContent";
import { useAuthState } from "@/hooks/useAuthState";
import { useEventPermissions } from "@/hooks/events/useEventPermissions";
import { LoadingScreen } from "@/components/ui/loading-screen";

export function EventFormWrapper(props: EventFormProps) {
  const { user, isLoading } = useAuthState();
  const { hasValidPermission, verifyingAuth } = useEventPermissions(props.initialData);

  if (isLoading || verifyingAuth) {
    return <LoadingScreen />;
  }

  return (
    <EventFormContent
      {...props}
      hasPermissionToEdit={hasValidPermission}
      user={user}
    />
  );
}
