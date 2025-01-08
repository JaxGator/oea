import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ReminderSettingsProps {
  eventId: string;
  enabled: boolean;
  intervals: string[];
  onUpdate: () => void;
}

export function ReminderSettings({ eventId, enabled, intervals, onUpdate }: ReminderSettingsProps) {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [reminderIntervals, setReminderIntervals] = useState<string[]>(intervals);
  const [newInterval, setNewInterval] = useState("");
  const { toast } = useToast();

  const handleToggle = async (checked: boolean) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ reminder_enabled: checked })
        .eq('id', eventId);

      if (error) throw error;

      setIsEnabled(checked);
      onUpdate();

      toast({
        title: "Success",
        description: `Reminders ${checked ? 'enabled' : 'disabled'} successfully`,
      });
    } catch (error: any) {
      console.error('Error updating reminder settings:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update reminder settings",
        variant: "destructive",
      });
    }
  };

  const addInterval = async () => {
    if (!newInterval) return;

    try {
      const updatedIntervals = [...reminderIntervals, newInterval];
      const { error } = await supabase
        .from('events')
        .update({ reminder_intervals: updatedIntervals })
        .eq('id', eventId);

      if (error) throw error;

      setReminderIntervals(updatedIntervals);
      setNewInterval("");
      onUpdate();

      toast({
        title: "Success",
        description: "Reminder interval added successfully",
      });
    } catch (error: any) {
      console.error('Error adding reminder interval:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add reminder interval",
        variant: "destructive",
      });
    }
  };

  const removeInterval = async (index: number) => {
    try {
      const updatedIntervals = reminderIntervals.filter((_, i) => i !== index);
      const { error } = await supabase
        .from('events')
        .update({ reminder_intervals: updatedIntervals })
        .eq('id', eventId);

      if (error) throw error;

      setReminderIntervals(updatedIntervals);
      onUpdate();

      toast({
        title: "Success",
        description: "Reminder interval removed successfully",
      });
    } catch (error: any) {
      console.error('Error removing reminder interval:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove reminder interval",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="reminder-toggle">Enable Event Reminders</Label>
        <Switch
          id="reminder-toggle"
          checked={isEnabled}
          onCheckedChange={handleToggle}
        />
      </div>

      {isEnabled && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {reminderIntervals.map((interval, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1"
              >
                <span>{interval}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeInterval(index)}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add interval (e.g., 1d, 2h)"
              value={newInterval}
              onChange={(e) => setNewInterval(e.target.value)}
              className="max-w-[200px]"
            />
            <Button onClick={addInterval}>Add</Button>
          </div>
        </div>
      )}
    </div>
  );
}