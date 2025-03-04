
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventForm } from "@/components/event/EventForm";
import type { Event } from "@/types/event";
import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/usePermissions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface EventEditDialogProps {
  initialData: Event;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  onSuccess?: () => void;
  isPastEvent?: boolean;
  isWixEvent?: boolean;
  forceAdmin?: boolean;
  forceCanManage?: boolean;
}

export function EventEditDialog({ 
  initialData, 
  showDialog, 
  setShowDialog, 
  onSuccess,
  isPastEvent = false,
  isWixEvent = false,
  forceAdmin = false,
  forceCanManage = false
}: EventEditDialogProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [localShowDialog, setLocalShowDialog] = useState(showDialog);
  const { user, isAuthenticated } = useAuthState();
  const { verifyPermission, isVerifying, showPermissionDeniedToast } = usePermissions();
  const [hasValidPermission, setHasValidPermission] = useState(false);
  const [permissionErrorMessage, setPermissionErrorMessage] = useState<string | null>(null);
  
  // Sync the local state with the parent state
  useEffect(() => {
    if (showDialog !== localShowDialog) {
      console.log("Syncing dialog state:", { showDialog, localShowDialog });
      setLocalShowDialog(showDialog);
    }
  }, [showDialog, localShowDialog]);
  
  // Perform permission check whenever the dialog opens
  useEffect(() => {
    const checkPermissions = async () => {
      if (!localShowDialog) return;
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
  }, [
    localShowDialog, 
    initialData, 
    verifyPermission, 
    forceAdmin, 
    forceCanManage,
    isPastEvent
  ]);

  const handleSuccess = useCallback(() => {
    console.log("EventEditDialog: handleSuccess called");
    setIsClosing(true);
    if (onSuccess) {
      onSuccess();
    }
    setLocalShowDialog(false);
    setShowDialog(false);
    setIsClosing(false);
    
    // Force a page reload to ensure data is refreshed
    if (initialData?.id) {
      toast.success("Event updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      toast.success("Event created successfully");
    }
  }, [initialData?.id, onSuccess, setShowDialog]);

  const handleOpenChange = (open: boolean) => {
    console.log("EventEditDialog: handleOpenChange", open);
    if (!isClosing) {
      setLocalShowDialog(open);
      setShowDialog(open);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (localShowDialog) {
        setShowDialog(false);
      }
    };
  }, [localShowDialog, setShowDialog]);

  return (
    <Dialog 
      open={localShowDialog} 
      onOpenChange={handleOpenChange}
    >
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        onEscapeKeyDown={(e) => {
          if (isClosing) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          if (isClosing) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? 'Edit Event' : 'Create Event'}
          </DialogTitle>
        </DialogHeader>
        
        {renderDialogContent()}
      </DialogContent>
    </Dialog>
  );
  
  // Helper function to render dialog content based on auth/permission state
  function renderDialogContent() {
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
          onSuccess={handleSuccess}
          forceAdmin={forceAdmin}
          forceCanManage={forceCanManage}
        />
      </div>
    );
  }
}
