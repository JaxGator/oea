import { useState } from "react";

export function useEventDialogs() {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  return {
    showEditDialog,
    setShowEditDialog,
    showDetailsDialog,
    setShowDetailsDialog,
  };
}