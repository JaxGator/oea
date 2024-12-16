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
  email?: string;
}

export function useMemberForm(member: Member, onUpdate: () => void, onClose: () => void) {
  const [username, setUsername] = useState(member.username);
  const [fullName, setFullName] = useState(member.full_name || "");
  const [email, setEmail] = useState(member.email || "");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(member.is_admin);
  const [isApproved, setIsApproved] = useState(member.is_approved);
  const [isMember, setIsMember] = useState(member.is_member);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Call the admin-user-management function
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('No access token');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-user-management`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            userId: member.id,
            email: email || undefined,
            password: password || undefined,
            username,
            fullName,
            isAdmin,
            isApproved,
            isMember,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user');
      }

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
        description: error instanceof Error ? error.message : "Failed to update member",
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
    handleSubmit,
  };
}