
import { EventFormProps } from "../EventFormTypes";
import { EventFormContent } from "./EventFormContent";
import { useAuthState } from "@/hooks/useAuthState";
import { useEventPermissions } from "@/hooks/events/useEventPermissions";
import { useEffect } from "react";

export function EventFormWrapper(props: EventFormProps) {
  const { user } = useAuthState();
  const { initialData, forceAdmin, forceCanManage } = props;
  
  const { 
    hasValidPermission,
    checkPermissions
  } = useEventPermissions(initialData, forceAdmin, forceCanManage);
  
  // Perform permission check when component mounts
  useEffect(() => {
    if (initialData) {
      console.log("EventFormWrapper: Checking permissions");
      checkPermissions();
    }
  }, [initialData, checkPermissions]);
  
  return (
    <EventFormContent
      {...props}
      hasPermissionToEdit={user ? hasValidPermission : false}
      user={user}
    />
  );
}
