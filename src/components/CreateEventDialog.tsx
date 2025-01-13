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

interface CreateEventDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateEventDialog({ open, onOpenChange, onSuccess }: CreateEventDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(open || false);
  const [canCreateEvents, setCanCreateEvents] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setDialogOpen(open ?? false);
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setDialogOpen(newOpen);
    onOpenChange?.(newOpen);
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
          toast({
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
  }, [toast]);

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
          <EventForm onSuccess={() => {
            onSuccess?.();
            handleOpenChange(false);
          }} />
        </div>
      </DialogContent>
    </Dialog>
  );
}