import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface CreatePollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePollDialog({ open, onOpenChange }: CreatePollDialogProps) {
  const { user } = useAuthState();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
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
      const { data: poll, error: pollError } = await supabase
        .from('polls')
        .insert({
          title,
          description: description || null,
          created_by: user!.id,
          status: 'active'
        })
        .select()
        .single();

      if (pollError) throw pollError;

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

      toast.success("Poll created successfully!");
      queryClient.invalidateQueries({ queryKey: ['active-polls'] });
      onOpenChange(false);
      setTitle("");
      setDescription("");
      setOptions(["", ""]);
    } catch (error) {
      console.error('Error creating poll:', error);
      toast.error("Failed to create poll");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Poll</DialogTitle>
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
            Create Poll
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}