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

export function CreateEventDialog() {
  const [open, setOpen] = useState(false);
  const [canCreateEvents, setCanCreateEvents] = useState(false);

  useEffect(() => {
    const checkUserPermissions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setCanCreateEvents(false);
        return;
      }

      // Check if user is admin by querying the profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      setCanCreateEvents(profile?.is_admin || false);
    };

    checkUserPermissions();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUserPermissions();
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!canCreateEvents) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#0d97d1] hover:bg-[#0d97d1]/90">
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <EventForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}