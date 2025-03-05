
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventForm } from "@/components/event/EventForm";
import type { Event } from "@/types/event";
import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";
import { useEventPermissions } from "@/hooks/events/useEventPermissions";
import { Button } from "@/components/ui/button";

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
  
  const { 
    verifyingAuth, 
    hasValidPermission, 
    checkPermissions
  } = useEventPermissions(initialData, forceAdmin, forceCanManage);
  
  // Sync the local state with the parent state
  useEffect(() => {
    if (showDialog !== localShowDialog) {
      console.log("Syncing dialog state:", { showDialog, localShowDialog });
      setLocalShowDialog(showDialog);
    }
  }, [showDialog, localShowDialog]);
  
  // Perform permission check whenever the dialog opens
  useEffect(() => {
    if (localShowDialog && initialData) {
      console.log("Dialog opened, checking permissions with override:", { 
        forceAdmin, 
        forceCanManage,
        isAdmin: user?.is_admin,
        isMember: user?.is_member,
        isApproved: user?.is_approved
      });
      checkPermissions();
    }
  }, [localShowDialog, initialData, checkPermissions, forceAdmin, forceCanManage, user?.is_admin, user?.is_member, user?.is_approved]);

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
    if (verifyingAuth) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="ml-2">Verifying authentication...</p>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      return (
        <div className="text-center py-6">
          <p className="text-red-500">You must be logged in to edit events</p>
          <Button 
            onClick={() => window.location.href = '/auth'} 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Sign In
          </Button>
        </div>
      );
    }
    
    // Check permissions only for existing events (editing)
    const needsPermissionCheck = initialData?.id;
    const isAdminOrMember = user?.is_admin || user?.is_member || user?.is_approved || forceAdmin || forceCanManage;
    
    if (needsPermissionCheck && !hasValidPermission && !isAdminOrMember) {
      return (
        <div className="text-center py-6">
          <p className="text-yellow-500">You don't have permission to edit this event</p>
          <p className="text-sm text-gray-500 mt-2">
            Only admins, approved members, or the event creator can edit this event.
          </p>
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
          forceAdmin={forceAdmin || !!user?.is_admin}
          forceCanManage={forceCanManage || !!user?.is_member || !!user?.is_approved}
        />
      </div>
    );
  }
}
