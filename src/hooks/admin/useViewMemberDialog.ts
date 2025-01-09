import { useState, useCallback } from "react";
import { Member } from "@/components/members/types";

export function useViewMemberDialog() {
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleViewMember = useCallback((member: Member) => {
    console.log('Opening view dialog for member:', member);
    setViewingMember(member);
    setIsViewDialogOpen(true);
  }, []);

  const handleCloseView = useCallback(() => {
    console.log('Closing view dialog');
    setIsViewDialogOpen(false);
    setViewingMember(null);
  }, []);

  return {
    viewingMember,
    isViewDialogOpen,
    handleViewMember,
    handleCloseView
  };
}