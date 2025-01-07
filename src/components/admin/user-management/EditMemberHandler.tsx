import { useState, useEffect } from "react";
import { Member } from "@/components/members/types";
import { EditMemberDialog } from "@/components/members/EditMemberDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface EditMemberHandlerProps {
  member: Member | null;
  onClose: () => void;
  onUpdate: () => void;
}

export function EditMemberHandler({ member, onClose, onUpdate }: EditMemberHandlerProps) {
  const [editingMember, setEditingMember] = useState<Member | null>(member);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('EditMemberHandler: member prop changed:', member);
    setEditingMember(member);
  }, [member]);

  const handleEditMember = async () => {
    if (!member) {
      console.log('EditMemberHandler: No member to edit');
      return;
    }

    try {
      console.log('EditMemberHandler: Fetching latest profile data for:', member.id);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        console.error('Session verification failed:', sessionError);
        navigate('/auth');
        return;
      }

      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', member.id)
        .maybeSingle();
      
      if (fetchError) {
        console.error('Profile fetch error:', fetchError);
        throw fetchError;
      }

      if (!profile) {
        throw new Error('Profile not found');
      }

      console.log('EditMemberHandler: Profile data fetched:', profile);
      setEditingMember({ ...member, ...profile });
    } catch (error) {
      console.error('Error in handleEditMember:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
      onClose();
    }
  };

  useEffect(() => {
    if (member && !editingMember) {
      handleEditMember();
    }
  }, [member, editingMember]);

  return editingMember ? (
    <EditMemberDialog
      member={editingMember}
      open={true}
      onOpenChange={(open) => !open && onClose()}
      onUpdate={onUpdate}
    />
  ) : null;
}