
import { EventFormProps } from "../EventFormTypes";
import { EventFormContent } from "./EventFormContent";
import { useAuthState } from "@/hooks/useAuthState";
import { usePermissions } from "@/hooks/usePermissions";
import { useEffect, useState } from "react";

export function EventFormWrapper(props: EventFormProps) {
  const { user } = useAuthState();
  const { initialData, forceAdmin, forceCanManage } = props;
  const { verifyPermission, isVerifying } = usePermissions();
  const [hasValidPermission, setHasValidPermission] = useState<boolean>(false);
  
  // Perform permission check when component mounts
  useEffect(() => {
    const checkPermissions = async () => {
      if (!initialData?.id) {
        // New event creation - permission granted
        setHasValidPermission(true);
        return;
      }
      
      // For existing events, verify edit permission
      const hasPermission = await verifyPermission(
        'edit',
        initialData.id,
        initialData.created_by
      );
      
      // Force permission if needed
      const effectivePermission = hasPermission || forceAdmin || forceCanManage;
      setHasValidPermission(effectivePermission);
    };
    
    checkPermissions();
  }, [initialData, verifyPermission, forceAdmin, forceCanManage]);
  
  return (
    <EventFormContent
      {...props}
      hasPermissionToEdit={hasValidPermission}
      user={user}
      isVerifyingPermission={isVerifying}
    />
  );
}
