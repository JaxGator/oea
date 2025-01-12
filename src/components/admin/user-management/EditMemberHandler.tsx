import { useState, useEffect, useCallback, memo } from "react";
import { Member } from "@/components/members/types";
import { EditMemberDialog } from "@/components/members/EditMemberDialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EditMemberHandlerProps {
  member: Member | null;
  onClose: () => void;
  onUpdate: () => void;
}

export const EditMemberHandler = memo(function EditMemberHandler({ 
  member, 
  onClose, 
  onUpdate 
}: EditMemberHandlerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [memberData, setMemberData] = useState<Member | null>(null);
  const { toast } = useToast();

  const fetchMemberData = useCallback(async () => {
    if (!member?.id) {
      console.error('EditMemberHandler: Invalid member ID:', member);
      toast({
        title: "Error",
        description: "Invalid member data. Please try again.",
        variant: "destructive",
      });
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      console.log('EditMemberHandler: Fetching member data for ID:', member.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', member.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('Member not found');
      }

      const enrichedData: Member = {
        ...data,
        full_name: data.full_name || '',
        avatar_url: data.avatar_url || '',
        is_admin: data.is_admin || false,
        is_approved: data.is_approved || false,
        is_member: data.is_member || false,
        event_reminders_enabled: data.event_reminders_enabled || false
      };

      console.log('EditMemberHandler: Member data fetched:', enrichedData);
      setMemberData(enrichedData);
    } catch (error) {
      console.error('EditMemberHandler: Error fetching member data:', error);
      toast({
        title: "Error",
        description: "Failed to load member data. Please try again.",
        variant: "destructive",
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  }, [member?.id, onClose, toast]);

  useEffect(() => {
    if (member?.id) {
      fetchMemberData();
    }
  }, [member?.id, fetchMemberData]);

  const handleDialogChange = useCallback((open: boolean) => {
    if (!open) {
      console.log('EditMemberHandler: Dialog closed');
      onClose();
    }
  }, [onClose]);

  const handleUpdateComplete = useCallback(() => {
    console.log('EditMemberHandler: Update completed, refreshing data');
    onUpdate();
    onClose();
  }, [onUpdate, onClose]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!memberData?.id || !memberData?.username) {
    console.log('EditMemberHandler: Invalid member data:', memberData);
    return null;
  }

  return (
    <EditMemberDialog
      member={memberData}
      open={true}
      onOpenChange={handleDialogChange}
      onUpdate={handleUpdateComplete}
    />
  );
});