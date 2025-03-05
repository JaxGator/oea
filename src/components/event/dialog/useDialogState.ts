
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export function useDialogState(
  showDialog: boolean, 
  setShowDialog: (show: boolean) => void,
  onSuccess?: () => void
) {
  const [isClosing, setIsClosing] = useState(false);
  const [localShowDialog, setLocalShowDialog] = useState(showDialog);
  
  // Sync the local state with the parent state
  useEffect(() => {
    if (showDialog !== localShowDialog) {
      console.log("Syncing dialog state:", { showDialog, localShowDialog });
      setLocalShowDialog(showDialog);
    }
  }, [showDialog, localShowDialog]);

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
    if (window.location.pathname.includes('/events/')) {
      toast.success("Event updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      toast.success("Event created successfully");
    }
  }, [onSuccess, setShowDialog]);

  const handleOpenChange = useCallback((open: boolean) => {
    console.log("EventEditDialog: handleOpenChange", open);
    if (!isClosing) {
      setLocalShowDialog(open);
      setShowDialog(open);
    }
  }, [isClosing, setShowDialog]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (localShowDialog) {
        setShowDialog(false);
      }
    };
  }, [localShowDialog, setShowDialog]);

  return {
    isClosing,
    localShowDialog,
    handleSuccess,
    handleOpenChange
  };
}
