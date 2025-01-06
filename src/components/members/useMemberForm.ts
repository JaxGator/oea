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
  const [username, setUsername] = useState(member.username);
  const [fullName, setFullName] = useState(member.full_name || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(member.is_admin);
  const [isApproved, setIsApproved] = useState(member.is_approved);
  const [isMember, setIsMember] = useState(member.is_member);
  const [avatarUrl, setAvatarUrl] = useState(member.avatar_url || "");
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
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