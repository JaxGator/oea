import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/auth/useProfile";
import { useSession } from "@/hooks/auth/useSession";

export function UserReminderPreferences() {
  const { user } = useSession();
  const { data: profile } = useProfile(user?.id);
  const [enabled, setEnabled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setEnabled(profile.event_reminders_enabled ?? false);
    }
  }, [profile]);

  const handleToggle = async (checked: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ event_reminders_enabled: checked })
        .eq('id', user?.id);

      if (error) throw error;

      setEnabled(checked);
      toast({
        title: "Success",
        description: `Event reminders ${checked ? 'enabled' : 'disabled'} successfully`,
      });
    } catch (error: any) {
      console.error('Error updating reminder preferences:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update reminder preferences",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Reminder Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between space-y-2">
          <Label htmlFor="event-reminders">Receive event reminders</Label>
          <Switch
            id="event-reminders"
            checked={enabled}
            onCheckedChange={handleToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
}