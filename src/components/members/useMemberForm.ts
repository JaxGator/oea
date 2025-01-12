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

  // Validate member object and provide defaults
  const safeMember = member ? { ...DEFAULT_MEMBER, ...member } : DEFAULT_MEMBER;

  const [username, setUsername] = useState(safeMember.username);
  const [fullName, setFullName] = useState(safeMember.full_name || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(safeMember.is_admin || false);
  const [isApproved, setIsApproved] = useState(safeMember.is_approved || false);
  const [isMember, setIsMember] = useState(safeMember.is_member || false);
  const [avatarUrl, setAvatarUrl] = useState(safeMember.avatar_url || '');

  const handleSubmit = async () => {
    try {
      if (!member?.id) {
        throw new Error('Member ID is required for updates');
      }

      console.log('useMemberForm: Submitting update for member:', {
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

      const { data, error } = await supabase
        .from('profiles')
        .update({
          username: username,
          full_name: fullName,
          is_admin: isAdmin,
          is_approved: isApproved,
          is_member: isMember,
          avatar_url: avatarUrl
        })
        .eq('id', member.id)
        .select();

      if (error) {
        console.error('Error updating member:', error);
        throw error;
      }

      console.log('useMemberForm: Update successful:', data);

      toast({
        title: "Success",
        description: "Member updated successfully",
      });
      
      onUpdate();
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