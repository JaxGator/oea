
import { useState } from "react";
import { useEventActions } from "@/hooks/events/useEventActions";
import { Event } from "@/types/event";
import { toast } from "sonner";

export function useEventCard(event: Event) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const {
    isDeleting,
    isPublishing,
    handleDelete,
    handleTogglePublish
  } = useEventActions(event);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return {
    isMenuOpen,
    toggleMenu,
    isDeleting,
    isPublishing,
    handleDelete,
    handleTogglePublish
  };
}
