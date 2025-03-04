
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { EventForm } from "./event/EventForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface CreateEventDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateEventDialog({ open, onOpenChange, onSuccess }: CreateEventDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(open || false);
  const [canCreateEvents, setCanCreateEvents] = useState(false);
  const { toast: uiToast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    setDialogOpen(open ?? false);
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setDialogOpen(newOpen);
    if (onOpenChange) onOpenChange(newOpen);
  };

  useEffect(() => {
    const checkUserPermissions = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          return;
        }

        if (!session?.user) {
          setCanCreateEvents(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin, is_approved, is_member')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Profile error:', profileError);
          uiToast({
            title: "Error",
            description: "Failed to check user permissions",
            variant: "destructive",
          });
          return;
        }

        // Allow both admins and approved members to create events
        setCanCreateEvents(
          (profile?.is_admin || false) || 
          (profile?.is_approved && profile?.is_member) || false
        );
      } catch (error) {
        console.error('Permission check error:', error);
        setCanCreateEvents(false);
      }
    };

    checkUserPermissions();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUserPermissions();
    });

    return () => subscription.unsubscribe();
  }, [uiToast]);

  const handleEventSuccess = () => {
    console.log('Event created successfully');
    toast.success('Event created successfully');
    
    // Close the dialog
    handleOpenChange(false);
    
    // Invalidate queries to ensure fresh data
    queryClient.invalidateQueries({ queryKey: ['events'] });
    queryClient.invalidateQueries({ queryKey: ['featuredEvents'] });
    
    // Call the parent success handler
    if (onSuccess) {
      onSuccess();
    }
  };

  if (!canCreateEvents) return null;

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-[#0d97d1] hover:bg-[#0d97d1]/90">
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <EventForm onSuccess={handleEventSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
