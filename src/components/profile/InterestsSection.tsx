import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface InterestsSectionProps {
  interests: string[];
  onUpdateInterests: (interests: string[]) => void;
}

export function InterestsSection({ interests, onUpdateInterests }: InterestsSectionProps) {
  const [newInterest, setNewInterest] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleAddInterest = async () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setIsUpdating(true);
      const updatedInterests = [...interests, newInterest.trim()];
      
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ interests: updatedInterests })
          .eq('id', (await supabase.auth.getUser()).data.user?.id);

        if (error) throw error;

        onUpdateInterests(updatedInterests);
        setNewInterest("");
        
        toast({
          title: "Interest added",
          description: "Your interests have been updated.",
        });
      } catch (error) {
        console.error('Error updating interests:', error);
        toast({
          title: "Error",
          description: "Failed to update interests. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleRemoveInterest = async (interestToRemove: string) => {
    setIsUpdating(true);
    const updatedInterests = interests.filter((i) => i !== interestToRemove);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ interests: updatedInterests })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      onUpdateInterests(updatedInterests);
      
      toast({
        title: "Interest removed",
        description: "Your interests have been updated.",
      });
    } catch (error) {
      console.error('Error removing interest:', error);
      toast({
        title: "Error",
        description: "Failed to remove interest. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInterest();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Interests</h3>
      <div className="flex flex-wrap gap-2">
        {interests.map((interest) => (
          <Badge
            key={interest}
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1"
          >
            {interest}
            <button
              onClick={() => handleRemoveInterest(interest)}
              className="ml-1 hover:text-destructive"
              disabled={isUpdating}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={newInterest}
          onChange={(e) => setNewInterest(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new interest..."
          className="flex-1"
          disabled={isUpdating}
        />
        <Button 
          onClick={handleAddInterest} 
          type="button"
          disabled={isUpdating}
        >
          Add
        </Button>
      </div>
    </div>
  );
}