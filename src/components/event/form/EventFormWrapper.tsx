
import { EventFormProps } from "../EventFormTypes";
import { EventFormContent } from "./EventFormContent";
import { useAuthState } from "@/hooks/useAuthState";
import { usePermissions } from "@/hooks/usePermissions";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePermissionStore } from "@/hooks/auth/usePermissionStore";

export function EventFormWrapper(props: EventFormProps) {
  const { user } = useAuthState();
  const { initialData, forceAdmin, forceCanManage } = props;
  const { getEffectivePermissions } = usePermissionStore();
  const [hasValidPermission, setHasValidPermission] = useState<boolean>(false);
  const [permissionChecked, setPermissionChecked] = useState<boolean>(false);
  const [isVerifyingPermissions, setIsVerifyingPermissions] = useState<boolean>(false);
  
  // Get effective permissions synchronously from the centralized store
  const effectivePermissions = getEffectivePermissions();
  const { isAdmin, canManageEvents } = effectivePermissions;
  
  // Perform permission check when component mounts
  useEffect(() => {
    const checkPermissions = async () => {
      setIsVerifyingPermissions(true);
      
      try {
        if (!initialData?.id) {
          // New event creation - permission granted
          setHasValidPermission(true);
          setPermissionChecked(true);
          return;
        }
        
        // For existing events, admins and managers always have permission
        if (isAdmin || canManageEvents || forceAdmin || forceCanManage) {
          console.log("Admin or manager detected, granting edit permission");
          setHasValidPermission(true);
          setPermissionChecked(true);
          return;
        }
        
        // For regular users, only the creator can edit
        const isCreator = initialData.created_by === user?.id;
        setHasValidPermission(isCreator);
        setPermissionChecked(true);
        
        console.log("Permission check complete:", {
          isAdmin,
          canManageEvents,
          isCreator,
          userId: user?.id,
          eventCreator: initialData.created_by,
          hasPermission: isAdmin || canManageEvents || isCreator
        });
      } finally {
        setIsVerifyingPermissions(false);
      }
    };
    
    checkPermissions();
  }, [initialData, isAdmin, canManageEvents, user?.id, forceAdmin, forceCanManage]);
  
  // If we're editing and permissions check has completed but denied
  if (initialData?.id && permissionChecked && !hasValidPermission && !isVerifyingPermissions) {
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
      isVerifyingPermission={isVerifyingPermissions}
    />
  );
}
