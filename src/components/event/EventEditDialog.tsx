
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventForm } from "@/components/event/EventForm";
import type { Event } from "@/types/event";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";
import { canEditEvent } from "@/utils/permissionsUtils";

interface EventEditDialogProps {
  initialData: Event;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  onSuccess?: () => void;
  isPastEvent?: boolean;
  isWixEvent?: boolean;
}

export function EventEditDialog({ 
  initialData, 
  showDialog, 
  setShowDialog, 
  onSuccess,
  isPastEvent = false,
  isWixEvent = false
}: EventEditDialogProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [localShowDialog, setLocalShowDialog] = useState(showDialog);
  const { user, isAuthenticated, isLoading } = useAuthState();
  
  // Sync the local state with the parent state
  useEffect(() => {
    setLocalShowDialog(showDialog);
  }, [showDialog]);
  
  console.log("EventEditDialog initialized with:", { 
    eventId: initialData?.id,
    eventTitle: initialData?.title,
    showDialog,
    localShowDialog,
    userId: user?.id,
    isAuthenticated,
    isLoading,
    isAdmin: user?.is_admin
  });

  // Check permissions whenever auth state or dialog visibility changes
  useEffect(() => {
    if (!isLoading && user && initialData && localShowDialog) {
      const isAdmin = user.is_admin || false;
      const canManageEvents = isAdmin || user.is_approved;
      const hasEditPermission = canEditEvent(user.id, isAdmin, canManageEvents, initialData.created_by || '');
      
      console.log("EventEditDialog - Permission check:", { 
        userId: user.id,
        eventCreator: initialData.created_by,
        isAdmin,
        canManageEvents,
        hasPermission: hasEditPermission
      });
      
      if (!hasEditPermission) {
        console.error("Permission denied: user cannot edit this event");
        toast.error("You don't have permission to edit this event");
        setLocalShowDialog(false);
        setShowDialog(false);
      }
    }
  }, [user, initialData, localShowDialog, setShowDialog, isLoading]);

  // Check authentication early - but only if the dialog should be shown and auth has finished loading
  useEffect(() => {
    if (!isLoading && !isAuthenticated && localShowDialog) {
      console.log("EventEditDialog: User not authenticated");
      toast.error("You must be logged in to edit events");
      setLocalShowDialog(false);
      setShowDialog(false);
    }
  }, [isAuthenticated, localShowDialog, setShowDialog, isLoading]);

  const handleSuccess = () => {
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
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

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

  // Don't render anything while loading authentication state or if not authenticated
  if (isLoading || (!isAuthenticated && localShowDialog)) {
    return null;
  }

  return (
    <Dialog 
      open={localShowDialog} 
      onOpenChange={handleOpenChange}
    >
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        onEscapeKeyDown={(e) => {
          // Prevent escape from closing if we're in the middle of an operation
          if (isClosing) {
            e.preventDefault();
          }
        }}
        onPointerDownOutside={(e) => {
          // Prevent clicking outside from closing if we're in the middle of an operation
          if (isClosing) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? 'Edit Event' : 'Create Event'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <EventForm 
            initialData={initialData}
            isPastEvent={isPastEvent}
            isWixEvent={isWixEvent}
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
