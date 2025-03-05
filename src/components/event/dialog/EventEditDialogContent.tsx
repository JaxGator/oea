
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { EventForm } from "@/components/event/EventForm";
import type { Event } from "@/types/event";
import { useAuthState } from "@/hooks/useAuthState";
import { usePermissions } from "@/hooks/usePermissions";

interface EventEditDialogContentProps {
  initialData: Event;
  isPastEvent?: boolean;
  isWixEvent?: boolean;
  forceAdmin?: boolean;
  forceCanManage?: boolean;
  onSuccess?: () => void;
}

export function EventEditDialogContent({
  initialData,
  isPastEvent = false,
  isWixEvent = false,
  forceAdmin = false,
  forceCanManage = false,
  onSuccess
}: EventEditDialogContentProps) {
  const { user, isAuthenticated } = useAuthState();
  const { verifyPermission, isVerifying, showPermissionDeniedToast } = usePermissions();
  const [hasValidPermission, setHasValidPermission] = useState(false);
  const [permissionErrorMessage, setPermissionErrorMessage] = useState<string | null>(null);
  
  // Perform permission check when component mounts
  useEffect(() => {
    const checkPermissions = async () => {
      setPermissionErrorMessage(null);
      
      if (!initialData?.id) {
        // New event creation - permission granted
        setHasValidPermission(true);
        return;
      }
      
      // For existing events, check if user has permission to edit
      const hasPermission = await verifyPermission(
        'edit', 
        initialData.id, 
        initialData.created_by,
        { showFeedback: false } // Don't show toast here, we'll use inline message
      );
      
      // Apply force overrides if provided
      const effectivePermission = hasPermission || forceAdmin || forceCanManage;
      
      if (!effectivePermission) {
        if (isPastEvent) {
          setPermissionErrorMessage("Past events can only be edited by administrators");
        } else {
          setPermissionErrorMessage("You don't have permission to edit this event. Only admins, approved members, or the event creator can edit events.");
        }
      }
      
      setHasValidPermission(effectivePermission);
    };
    
    checkPermissions();
  }, [initialData, verifyPermission, forceAdmin, forceCanManage, isPastEvent]);

  // Helper function to render dialog content based on auth/permission state
  if (isVerifying) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2">Verifying permissions...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="text-center py-6">
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>You must be logged in to edit events</AlertDescription>
        </Alert>
        <Button 
          onClick={() => window.location.href = '/auth'} 
          className="mt-4"
        >
          Sign In
        </Button>
      </div>
    );
  }
  
  // Check permissions only for existing events (editing)
  const needsPermissionCheck = initialData?.id;
  
  if (needsPermissionCheck && !hasValidPermission && permissionErrorMessage) {
    return (
      <div className="text-center py-6">
        <Alert variant="warning" className="mb-4">
          <AlertDescription>{permissionErrorMessage}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // User has permission or is creating a new event
  return (
    <div className="space-y-6">
      <EventForm 
        initialData={initialData}
        isPastEvent={isPastEvent}
        isWixEvent={isWixEvent}
        onSuccess={onSuccess}
        forceAdmin={forceAdmin}
        forceCanManage={forceCanManage}
      />
    </div>
  );
}
