import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface GuestInputProps {
  onAddGuest: (name: string) => void;
  isApproved: boolean;
}

export function GuestInput({ onAddGuest, isApproved }: GuestInputProps) {
  const [newGuestName, setNewGuestName] = useState("");

  const handleAddGuest = () => {
    if (!isApproved) {
      toast.error("You need to be approved by an admin before you can add guests to events.");
      return;
    }

    if (newGuestName.trim()) {
      onAddGuest(newGuestName.trim());
      setNewGuestName("");
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Guest's first name (optional)"
        value={newGuestName}
        onChange={(e) => setNewGuestName(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAddGuest();
          }
        }}
        disabled={!isApproved}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleAddGuest}
        disabled={!isApproved}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}