
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventForm } from "@/components/event/EventForm";
import type { Event } from "@/types/event";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Loader2 } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";
import { canEditEvent } from "@/utils/permissionsUtils";
import { supabase } from "@/integrations/supabase/client";

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
  const [verifyingAuth, setVerifyingAuth] = useState(true);
  const [checkedSessionData, setCheckedSessionData] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuthState();
  
  // Sync the local state with the parent state
  useEffect(() => {
    setLocalShowDialog(showDialog);
  }, [showDialog]);
  
  // Perform direct auth check on component mount
  useEffect(() => {
    const verifyAuthStatus = async () => {
      try {
        setVerifyingAuth(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          toast.error("Authentication error. Please try logging in again.");
          setLocalShowDialog(false);
          setShowDialog(false);
          return;
        }
        
        const sessionExists = !!data.session;
        
        console.log("EventEditDialog - Direct auth check:", { 
          sessionExists,
          userId: data.session?.user?.id, // Fixed: access user.id instead of session.id
          timestamp: new Date().toISOString()
        });
        
        setCheckedSessionData(true);
        
        if (!sessionExists) {
          console.error("Authentication error: No active session");
          toast.error("You must be logged in to edit events");
          setLocalShowDialog(false);
          setShowDialog(false);
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        toast.error("Authentication error. Please try logging in again.");
      } finally {
        setVerifyingAuth(false);
      }
    };
    
    if (localShowDialog) {
      verifyAuthStatus();
    }
  }, [localShowDialog, setShowDialog]);

  console.log("EventEditDialog initialized with:", { 
    eventId: initialData?.id,
    eventTitle: initialData?.title,
    showDialog,
    localShowDialog,
    userId: user?.id,
    isAuthenticated,
    isLoading,
    isAdmin: user?.is_admin,
    verifyingAuth,
    checkedSessionData
  });

  // Check permissions whenever auth state or dialog visibility changes
  useEffect(() => {
    if (!isLoading && !verifyingAuth && localShowDialog) {
      // First check if the user is authenticated at all
      if (!isAuthenticated) {
        console.error("Authentication error: User not authenticated");
        toast.error("You must be logged in to edit events");
        setLocalShowDialog(false);
        setShowDialog(false);
        return;
      }
      
      // Then check if we have a user object with an ID
      if (!user || !user.id) {
        console.error("Authentication error: No user ID available");
        toast.error("User profile not available. Please try logging in again.");
        setLocalShowDialog(false);
        setShowDialog(false);
        return;
      }
      
      // Finally check edit permissions for this specific event
      if (initialData && initialData.id) {
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
    }
  }, [user, initialData, localShowDialog, setShowDialog, isLoading, isAuthenticated, verifyingAuth]);

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
  if (verifyingAuth || isLoading) {
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
  if (!isAuthenticated) {
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
