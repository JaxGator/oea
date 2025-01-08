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

      console.log('useMemberForm: Submitting update for member:', member.id);

      const { error } = await supabase.functions.invoke('admin-user-management', {
        body: {
          userId: member.id,
          username,
          fullName,
          email,
          password,
          isAdmin,
          isApproved,
          isMember,
          avatarUrl,
        },
      });

      if (error) throw error;

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