import { useState, useEffect } from "react";
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

export function EditMemberHandler({ member, onClose, onUpdate }: EditMemberHandlerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [memberData, setMemberData] = useState<Member | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!member?.id) {
        console.error('EditMemberHandler: Invalid member ID:', member);
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

        console.log('EditMemberHandler: Member data fetched:', data);
        setMemberData(data as Member);
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
    };

    if (member?.id) {
      fetchMemberData();
    }
  }, [member?.id, onClose, toast]);

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

  if (!memberData?.id || !memberData?.username) {
    console.log('EditMemberHandler: Invalid member data:', memberData);
    return null;
  }

  return (
    <EditMemberDialog
      member={memberData}
      open={true}
      onOpenChange={handleDialogChange}
      onUpdate={onUpdate}
    />
  );
}