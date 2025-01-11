import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface InterestsSectionProps {
  interests: string[];
  onUpdateInterests: (interests: string[]) => void;
}

export function InterestsSection({ interests, onUpdateInterests }: InterestsSectionProps) {
  const [newInterest, setNewInterest] = useState("");

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      onUpdateInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    onUpdateInterests(interests.filter((i) => i !== interest));
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
        />
        <Button onClick={handleAddInterest} type="button">
          Add
        </Button>
      </div>
    </div>
  );
}