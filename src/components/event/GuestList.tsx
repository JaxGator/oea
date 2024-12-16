import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Guest {
  firstName: string;
}

interface GuestListProps {
  onGuestsChange: (guests: Guest[]) => void;
}

export function GuestList({ onGuestsChange }: GuestListProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newGuestName, setNewGuestName] = useState("");
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const checkApprovalStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('is_approved')
          .eq('id', user.id)
          .single();
        
        setIsApproved(!!data?.is_approved);
      }
    };

    checkApprovalStatus();
  }, []);

  const addGuest = () => {
    if (!isApproved) {
      toast.error("You need to be approved by an admin before you can add guests to events.");
      return;
    }

    if (newGuestName.trim()) {
      const updatedGuests = [...guests, { firstName: newGuestName.trim() }];
      setGuests(updatedGuests);
      onGuestsChange(updatedGuests);
      setNewGuestName("");
    }
  };

  const removeGuest = (index: number) => {
    if (!isApproved) {
      toast.error("You need to be approved by an admin to manage guests.");
      return;
    }

    const updatedGuests = guests.filter((_, i) => i !== index);
    setGuests(updatedGuests);
    onGuestsChange(updatedGuests);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Guest's first name (optional)"
          value={newGuestName}
          onChange={(e) => setNewGuestName(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addGuest();
            }
          }}
          disabled={!isApproved}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={addGuest}
          disabled={!isApproved}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      {guests.length > 0 && (
        <div className="space-y-2">
          {guests.map((guest, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1 p-2 bg-gray-50 rounded-md">
                {guest.firstName}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeGuest(index)}
                disabled={!isApproved}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}