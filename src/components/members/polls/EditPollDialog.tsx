
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { PollWithDetails } from "@/types/database.types";

interface EditPollDialogProps {
  poll: PollWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPollDialog({ poll, open, onOpenChange }: EditPollDialogProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(poll.title);
  const [description, setDescription] = useState(poll.description || "");
  const [options, setOptions] = useState(poll.poll_options.map(opt => opt.option_text));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a poll title");
      return;
    }

    if (options.filter(opt => opt.trim()).length < 2) {
      toast.error("Please add at least two options");
      return;
    }

    setIsSubmitting(true);
    try {
      // Update poll details
      const { error: pollError } = await supabase
        .from('polls')
        .update({
          title,
          description: description || null
        })
        .eq('id', poll.id);

      if (pollError) throw pollError;

      // Delete existing options
      const { error: deleteError } = await supabase
        .from('poll_options')
        .delete()
        .eq('poll_id', poll.id);

      if (deleteError) throw deleteError;

      // Insert new options
      const { error: optionsError } = await supabase
        .from('poll_options')
        .insert(
          options
            .filter(opt => opt.trim())
            .map((option_text, index) => ({
              poll_id: poll.id,
              option_text,
              display_order: index
            }))
        );

      if (optionsError) throw optionsError;

      toast.success("Poll updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['active-polls'] });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating poll:', error);
      toast.error("Failed to update poll");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Poll</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Poll title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                {options.length > 2 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleAddOption}
            >
              <Plus className="h-4 w-4" />
              Add Option
            </Button>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
