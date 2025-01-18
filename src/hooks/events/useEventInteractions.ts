import { useCallback } from "react";

export function useEventInteractions(setShowDetailsDialog: (show: boolean) => void) {
  const handleCardClick = useCallback((e: React.MouseEvent | React.KeyboardEvent | undefined) => {
    if (!e) return;
    
    // Stop propagation for all interactive elements
    const target = e.target as HTMLElement;
    const isInteractiveElement = 
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      target.closest('button') ||
      target.closest('a') ||
      target.closest('[role="button"]') ||
      target.closest('[data-interactive="true"]') ||
      target.closest('dialog') ||
      target.closest('[role="dialog"]');

    if (isInteractiveElement) {
      e.stopPropagation();
      return;
    }

    if (e.type === 'keydown') {
      const keyEvent = e as React.KeyboardEvent;
      if (keyEvent.key !== 'Enter' && keyEvent.key !== ' ') {
        return;
      }
      if (keyEvent.key === ' ') {
        e.preventDefault();
      }
    }

    setShowDetailsDialog(true);
  }, [setShowDetailsDialog]);

  return { handleCardClick };
}