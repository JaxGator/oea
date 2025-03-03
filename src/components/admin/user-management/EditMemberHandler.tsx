
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
  const [isOpen, setIsOpen] = useState(false);
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
        console.error('EditMemberHandler: Database error:', error);
        throw error;
      }
      
      if (!data) {
        console.error('EditMemberHandler: Member not found');
        throw new Error('Member not found');
      }

      const enrichedData: Member = {
        id: data.id,
        username: data.username || '',
        full_name: data.full_name || '',
        avatar_url: data.avatar_url || '',
        is_admin: Boolean(data.is_admin),
        is_approved: Boolean(data.is_approved),
        is_member: Boolean(data.is_member),
        created_at: data.created_at || new Date().toISOString(),
        event_reminders_enabled: Boolean(data.event_reminders_enabled),
        email: data.email || null,
        email_notifications: Boolean(data.email_notifications),
        in_app_notifications: Boolean(data.in_app_notifications),
        interests: data.interests || [],
        updated_at: data.updated_at || null,
        leaderboard_opt_out: Boolean(data.leaderboard_opt_out)
      };

      console.log('EditMemberHandler: Member data fetched:', enrichedData);
      setMemberData(enrichedData);
      setIsOpen(true); // Only open dialog after data is loaded
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
    } else {
      setMemberData(null);
      setIsOpen(false);
    }
  }, [member?.id, fetchMemberData]);

  const handleUpdateComplete = useCallback(async (updatedData: Member) => {
    if (!updatedData?.id) {
      console.error('EditMemberHandler: Invalid update data:', updatedData);
      return;
    }

    try {
      console.log('EditMemberHandler: Starting update with data:', updatedData);
      setIsLoading(true);

      // Use the admin_update_user RPC function to update the user
      const { error } = await supabase.rpc('admin_update_user', {
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        target_user_id: updatedData.id,
        new_username: updatedData.username || '',
        new_full_name: updatedData.full_name || '',
        new_avatar_url: updatedData.avatar_url || '',
        new_is_admin: Boolean(updatedData.is_admin),
        new_is_approved: Boolean(updatedData.is_approved),
        new_is_member: Boolean(updatedData.is_member)
      });

      if (error) throw error;

      console.log('EditMemberHandler: Update successful');
      await onUpdate();
      
      toast({
        title: "Success",
        description: "Member updated successfully",
      });
      
      setIsOpen(false);
      onClose();
    } catch (error) {
      console.error('EditMemberHandler: Error in handleUpdateComplete:', error);
      toast({
        title: "Error",
        description: "Failed to update member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [onUpdate, onClose, toast]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
    setIsOpen(open);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  // Only render dialog when we have valid member data
  if (!memberData?.id || !memberData?.username) {
    console.log('EditMemberHandler: Invalid member data:', memberData);
    return null;
  }

  return (
    <EditMemberDialog
      member={memberData}
      open={isOpen}
      onOpenChange={handleOpenChange}
      onUpdate={handleUpdateComplete}
    />
  );
});
