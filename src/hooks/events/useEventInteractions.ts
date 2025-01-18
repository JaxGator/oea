import { useState } from "react";

export function useEventInteractions(setShowDetailsDialog: (show: boolean) => void) {
  const handleCardClick = (e: React.MouseEvent | React.KeyboardEvent | undefined) => {
    if (!e) return;
    
    const target = e.target as HTMLElement;
    const isInteractiveElement = 
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      target.closest('button') ||
      target.closest('a') ||
      target.closest('[role="button"]') ||
      target.closest('[data-interactive="true"]');

    if (isInteractiveElement) {
      return;
    }

    if (e.type === 'keydown') {
      const keyEvent = e as React.KeyboardEvent;
      if (keyEvent.key !== 'Enter' && keyEvent.key !== ' ') {
        return;
      }
      if (keyEvent.key === ' ') {
        keyEvent.preventDefault();
      }
    }

    setShowDetailsDialog(true);
  };

  return { handleCardClick };
}