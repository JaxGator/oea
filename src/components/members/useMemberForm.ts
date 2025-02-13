
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Member } from "./types";

const DEFAULT_MEMBER: Member = {
  id: '',
  username: '',
  full_name: null,
  avatar_url: null,
  is_admin: false,
  is_approved: false,
  is_member: false,
  created_at: new Date().toISOString(),
  event_reminders_enabled: false,
  email: null,
  email_notifications: true,
  in_app_notifications: true,
  interests: null,
  updated_at: null,
  leaderboard_opt_out: false
};

export function useMemberForm(member: Member | null, onUpdate: () => void, onClose: () => void) {
  const { toast } = useToast();
  const safeMember = member ? { ...DEFAULT_MEMBER, ...member } : DEFAULT_MEMBER;

  // Initialize state with member data
  const [username, setUsername] = useState(safeMember.username);
  const [fullName, setFullName] = useState(safeMember.full_name || '');
  const [email, setEmail] = useState(safeMember.email || '');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(safeMember.is_admin);
  const [isApproved, setIsApproved] = useState(safeMember.is_approved);
  const [isMember, setIsMember] = useState(safeMember.is_member);
  const [avatarUrl, setAvatarUrl] = useState(safeMember.avatar_url || '');

  const handleSubmit = async () => {
    try {
      if (!member?.id) {
        throw new Error('Member ID is required for updates');
      }

      const { error } = await supabase.functions.invoke('admin-user-management', {
        body: {
          userId: member.id,
          username,
          fullName,
          avatarUrl,
          isAdmin,
          isApproved,
          isMember,
          email: email || undefined,
          password: password || undefined
        }
      });

      if (error) {
        console.error('Error updating member:', error);
        throw error;
      }

      await onUpdate();
      
      toast({
        title: "Success",
        description: password 
          ? "Member updated successfully (including password)" 
          : "Member updated successfully",
      });

      onClose();
    } catch (error) {
      console.error('Error updating member:', error);
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
    email,
    setEmail,
    password,
    setPassword,
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
