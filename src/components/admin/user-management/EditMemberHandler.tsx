import { useState, useEffect } from "react";
import { Member } from "@/components/members/types";
import { EditMemberDialog } from "@/components/members/EditMemberDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

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
        console.error('Profile not found for ID:', memberData.id);
        toast({
          title: "Error",
          description: "User profile not found",
          variant: "destructive",
        });
        onClose();
        return;
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
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
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