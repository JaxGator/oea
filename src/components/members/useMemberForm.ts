import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Member {
  id: string;
  username: string;
  full_name: string | null;
  is_admin: boolean;
  is_approved: boolean;
  is_member: boolean;
}

export function useMemberForm(member: Member, onUpdate: () => void, onClose: () => void) {
  const [username, setUsername] = useState(member.username);
  const [fullName, setFullName] = useState(member.full_name || "");
  const [isAdmin, setIsAdmin] = useState(member.is_admin);
  const [isApproved, setIsApproved] = useState(member.is_approved);
  const [isMember, setIsMember] = useState(member.is_member);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          full_name: fullName,
          is_admin: isAdmin,
          is_approved: isApproved,
          is_member: isMember,
        })
        .eq('id', member.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Member has been updated",
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
    isAdmin,
    setIsAdmin,
    isApproved,
    setIsApproved,
    isMember,
    setIsMember,
    handleSubmit,
  };
}