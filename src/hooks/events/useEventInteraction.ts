import { useState } from "react";

export function useEventInteraction() {
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const handleInteraction = (e: React.MouseEvent | React.KeyboardEvent | undefined) => {
    if (!e) return;
    
    // Check if the event is coming from an interactive element
    const target = e.target as HTMLElement;
    const isInteractiveElement = 
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      target.closest('button') ||
      target.closest('a') ||
      target.closest('[role="button"]') ||
      target.closest('[data-interactive="true"]');

    // If it's an interactive element, let it handle its own click
    if (isInteractiveElement) {
      return;
    }

    // For keyboard events, only proceed if it's Enter or Space
    if (e.type === 'keydown') {
      const keyEvent = e as React.KeyboardEvent;
      if (keyEvent.key !== 'Enter' && keyEvent.key !== ' ') {
        return;
      }
      // Prevent page scroll on space press
      if (keyEvent.key === ' ') {
        keyEvent.preventDefault();
      }
    }

    setShowDetailsDialog(true);
  };

  return {
    showDetailsDialog,
    setShowDetailsDialog,
    handleInteraction
  };
}