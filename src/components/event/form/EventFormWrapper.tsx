
import { EventFormProps } from "../EventFormTypes";
import { EventFormContent } from "./EventFormContent";
import { useAuthState } from "@/hooks/useAuthState";
import { usePermissions } from "@/hooks/usePermissions";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function EventFormWrapper(props: EventFormProps) {
  const { user } = useAuthState();
  const { initialData, forceAdmin, forceCanManage } = props;
  const { verifyPermission, isVerifying } = usePermissions();
  const [hasValidPermission, setHasValidPermission] = useState<boolean>(false);
  const [permissionChecked, setPermissionChecked] = useState<boolean>(false);
  
  // Perform permission check when component mounts
  useEffect(() => {
    const checkPermissions = async () => {
      if (!initialData?.id) {
        // New event creation - permission granted
        setHasValidPermission(true);
        setPermissionChecked(true);
        return;
      }
      
      // For existing events, verify edit permission
      const hasPermission = await verifyPermission(
        'edit',
        initialData.id,
        initialData.created_by,
        { showFeedback: false } // Don't show toast here, we'll use inline message
      );
      
      // Force permission if needed
      const effectivePermission = hasPermission || forceAdmin || forceCanManage;
      setHasValidPermission(effectivePermission);
      setPermissionChecked(true);
    };
    
    checkPermissions();
  }, [initialData, verifyPermission, forceAdmin, forceCanManage]);
  
  // If we're editing and permissions check has completed but denied
  if (initialData?.id && permissionChecked && !hasValidPermission && !isVerifying) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>
            You don't have permission to edit this event. Only the event creator, administrators, 
            or approved members can edit events.
          </AlertDescription>
        </Alert>
        
        <EventFormContent
          {...props}
          hasPermissionToEdit={false}
          user={user}
          isVerifyingPermission={false}
        />
      </div>
    );
  }
  
  return (
    <EventFormContent
      {...props}
      hasPermissionToEdit={hasValidPermission}
      user={user}
      isVerifyingPermission={isVerifying}
    />
  );
}
