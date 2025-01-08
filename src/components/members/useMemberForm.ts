import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Member {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  is_approved: boolean;
  is_member: boolean;
}

export function useMemberForm(member: Member, onUpdate: () => void, onClose: () => void) {
  // Validate member object and provide defaults
  if (!member || typeof member !== 'object') {
    console.error('useMemberForm: Invalid member object provided:', member);
    throw new Error('Invalid member data provided to useMemberForm');
  }

  const [username, setUsername] = useState(member.username || '');
  const [fullName, setFullName] = useState(member.full_name || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(member.is_admin || false);
  const [isApproved, setIsApproved] = useState(member.is_approved || false);
  const [isMember, setIsMember] = useState(member.is_member || false);
  const [avatarUrl, setAvatarUrl] = useState(member.avatar_url || '');
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      if (!member.id) {
        throw new Error('Member ID is required for updates');
      }

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