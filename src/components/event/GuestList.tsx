import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GuestInput } from "./guest/GuestInput";
import { GuestListDisplay } from "./guest/GuestListDisplay";

interface Guest {
  firstName: string;
}

interface GuestListProps {
  onGuestsChange: (guests: Guest[]) => void;
  initialGuests?: Guest[];
}

export function GuestList({ onGuestsChange, initialGuests = [] }: GuestListProps) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
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

  useEffect(() => {
    if (initialGuests.length > 0) {
      setGuests(initialGuests);
    }
  }, [initialGuests]);

  const addGuest = (name: string) => {
    const updatedGuests = [...guests, { firstName: name }];
    setGuests(updatedGuests);
    onGuestsChange(updatedGuests);
  };

  const removeGuest = (index: number) => {
    const updatedGuests = guests.filter((_, i) => i !== index);
    setGuests(updatedGuests);
    onGuestsChange(updatedGuests);
  };

  return (
    <div className="space-y-4">
      <GuestInput onAddGuest={addGuest} isApproved={isApproved} />
      <GuestListDisplay 
        guests={guests} 
        onRemoveGuest={removeGuest}
        isApproved={isApproved}
      />
    </div>
  );
}