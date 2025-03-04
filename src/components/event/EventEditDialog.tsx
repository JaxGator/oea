
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventForm } from "@/components/event/EventForm";
import type { Event } from "@/types/event";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";
import { useAuthVerification } from "./hooks/useAuthVerification";

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
  const { user, isAuthenticated } = useAuthState();
  const { 
    verifyingAuth, 
    hasValidPermission, 
    checkAuthAndPermissions 
  } = useAuthVerification(initialData);
  
  // Sync the local state with the parent state
  useEffect(() => {
    setLocalShowDialog(showDialog);
  }, [showDialog]);
  
  // Perform direct auth check on component mount
  useEffect(() => {
    if (localShowDialog) {
      checkAuthAndPermissions();
    }
  }, [localShowDialog, checkAuthAndPermissions]);

  console.log("EventEditDialog initialized with:", { 
    eventId: initialData?.id,
    eventTitle: initialData?.title,
    showDialog,
    localShowDialog,
    userId: user?.id,
    isAuthenticated,
    hasValidPermission,
    verifyingAuth
  });

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
      setTimeout(() => {
        window.location.reload();
      }, 500);
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

  // Show loading state while checking authentication
  if (verifyingAuth) {
    return (
      <Dialog open={localShowDialog} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="ml-2">Verifying authentication...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Don't render anything if not authenticated
  if (!hasValidPermission) {
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
