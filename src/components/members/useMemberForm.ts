import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Member } from "./types";

const DEFAULT_MEMBER: Member = {
  id: '',
  username: '',
  full_name: '',
  avatar_url: '',
  is_admin: false,
  is_approved: false,
  is_member: false,
  created_at: new Date().toISOString(),
  event_reminders_enabled: false
};

export function useMemberForm(member: Member | null, onUpdate: () => void, onClose: () => void) {
  const { toast } = useToast();
  const safeMember = member ? { ...DEFAULT_MEMBER, ...member } : DEFAULT_MEMBER;

  const [username, setUsername] = useState(safeMember.username);
  const [fullName, setFullName] = useState(safeMember.full_name || '');
  const [isAdmin, setIsAdmin] = useState(safeMember.is_admin || false);
  const [isApproved, setIsApproved] = useState(safeMember.is_approved || false);
  const [isMember, setIsMember] = useState(safeMember.is_member || false);
  const [avatarUrl, setAvatarUrl] = useState(safeMember.avatar_url || '');

  const handleSubmit = async () => {
    try {
      if (!member?.id) {
        throw new Error('Member ID is required for updates');
      }

      console.log('useMemberForm: Starting member update:', {
        memberId: member.id,
        updates: {
          username,
          fullName,
          isAdmin,
          isApproved,
          isMember,
          avatarUrl
        }
      });

      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser?.user?.id) {
        throw new Error('No authenticated user found');
      }

      console.log('useMemberForm: Calling admin_update_user function');
      const { error } = await supabase.rpc('admin_update_user', {
        admin_id: currentUser.user.id,
        target_user_id: member.id,
        new_username: username,
        new_full_name: fullName,
        new_avatar_url: avatarUrl,
        new_is_admin: isAdmin,
        new_is_approved: isApproved,
        new_is_member: isMember
      });

      if (error) {
        console.error('useMemberForm: Error from admin_update_user:', error);
        throw error;
      }

      console.log('useMemberForm: Update successful');
      
      // Call onUpdate and wait for it to complete
      await onUpdate();
      
      toast({
        title: "Success",
        description: "Member updated successfully",
      });

      onClose();
    } catch (error) {
      console.error('useMemberForm: Error updating member:', error);
      toast({
        title: "Error",
        description: "Failed to update member",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    username,
    setUsername,
    fullName,
    setFullName,
    isAdmin,
    setIsAdmin,
    isApproved,
    setIsApproved,
    isMember,
    setIsMember,
    avatarUrl,
    setAvatarUrl,
    handleSubmit,
  };
}