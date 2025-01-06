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
  email?: string;
}

export function useMemberForm(member: Member | null, onUpdate: () => void, onClose: () => void) {
  // Initialize state with member's current values or defaults
  const [username, setUsername] = useState(member?.username || "");
  const [fullName, setFullName] = useState(member?.full_name || "");
  const [email, setEmail] = useState(member?.email || "");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(member?.is_admin || false);
  const [isApproved, setIsApproved] = useState(member?.is_approved || false);
  const [isMember, setIsMember] = useState(member?.is_member || false);
  const [avatarUrl, setAvatarUrl] = useState(member?.avatar_url || "");
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!member?.id) {
      toast({
        title: "Error",
        description: "No member selected for editing",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('admin-user-management', {
        body: {
          userId: member.id,
          username,
          fullName,
          email: email || undefined, // Only send if not empty
          password: password || undefined, // Only send if not empty
          isAdmin,
          isApproved,
          isMember,
          avatarUrl,
        },
      });

      if (error) {
        console.error('Error updating member:', error);
        throw error;
      }

      console.log('Update response:', data);

      toast({
        title: "Success",
        description: "Member updated successfully",
      });
      
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error('Error updating member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update member",
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