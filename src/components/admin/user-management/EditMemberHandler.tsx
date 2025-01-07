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
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('EditMemberHandler: member prop changed:', member);
    if (member) {
      fetchMemberData(member);
    } else {
      setEditingMember(null);
    }
  }, [member]);

  const fetchMemberData = async (memberData: Member) => {
    setIsLoading(true);
    try {
      console.log('EditMemberHandler: Fetching latest profile data for:', memberData.id);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        console.error('Session verification failed:', sessionError);
        toast({
          title: "Authentication Error",
          description: "Please sign in again",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', memberData.id)
        .maybeSingle();
      
      if (fetchError) {
        console.error('Profile fetch error:', fetchError);
        throw fetchError;
      }

      if (!profile) {
        throw new Error('Profile not found');
      }

      console.log('EditMemberHandler: Profile data fetched:', profile);
      setEditingMember({ ...memberData, ...profile });
    } catch (error) {
      console.error('Error in fetchMemberData:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      console.log('EditMemberHandler: Dialog closed');
      onClose();
    }
  };

  if (isLoading) {
    return null; // Or return a loading spinner
  }

  return editingMember ? (
    <EditMemberDialog
      member={editingMember}
      open={true}
      onOpenChange={handleDialogChange}
      onUpdate={onUpdate}
    />
  ) : null;
}