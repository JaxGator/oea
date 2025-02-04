
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

  // Initialize state with member data
  const [username, setUsername] = useState(safeMember.username);
  const [fullName, setFullName] = useState(safeMember.full_name || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(safeMember.is_admin || false);
  const [isApproved, setIsApproved] = useState(safeMember.is_approved || false);
  const [isMember, setIsMember] = useState(safeMember.is_member || false);
  const [avatarUrl, setAvatarUrl] = useState(safeMember.avatar_url || '');

  // Initialize email from auth data
  useState(() => {
    const fetchUserEmail = async () => {
      if (member?.id) {
        const { data: authData, error } = await supabase.auth.admin.getUserById(member.id);
        if (!error && authData?.user?.email) {
          setEmail(authData.user.email);
        }
      }
    };
    fetchUserEmail();
  }, [member?.id]);

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
          avatarUrl,
          hasEmail: !!email,
          hasPassword: !!password
        }
      });

      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser?.user?.id) {
        throw new Error('No authenticated user found');
      }

      // Call admin-user-management function for full update
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
        console.error('useMemberForm: Error from admin-user-management:', error);
        throw error;
      }

      console.log('useMemberForm: Update successful');
      
      await onUpdate();
      
      toast({
        title: "Success",
        description: password 
          ? "Member updated successfully (including password)" 
          : "Member updated successfully",
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
