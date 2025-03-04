
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
    if (showDialog !== localShowDialog) {
      setLocalShowDialog(showDialog);
    }
  }, [showDialog, localShowDialog]);
  
  // Perform direct auth check on component mount
  useEffect(() => {
    if (localShowDialog && initialData) {
      checkAuthAndPermissions();
    }
  }, [localShowDialog, initialData, checkAuthAndPermissions]);

  console.log("EventEditDialog state:", { 
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

  // Important: We need to render the dialog regardless of auth state, but conditionally render content
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
        
        {verifyingAuth ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="ml-2">Verifying authentication...</p>
          </div>
        ) : !isAuthenticated ? (
          <div className="text-center py-6">
            <p className="text-red-500">You must be logged in to edit events</p>
            <button 
              onClick={() => window.location.href = '/auth'} 
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Sign In
            </button>
          </div>
        ) : !hasValidPermission && initialData?.id ? (
          <div className="text-center py-6">
            <p className="text-yellow-500">You don't have permission to edit this event</p>
          </div>
        ) : (
          <div className="space-y-6">
            <EventForm 
              initialData={initialData}
              isPastEvent={isPastEvent}
              isWixEvent={isWixEvent}
              onSuccess={handleSuccess}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
