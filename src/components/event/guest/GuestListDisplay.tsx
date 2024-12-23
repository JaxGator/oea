import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

interface Guest {
  firstName: string;
}

interface GuestListDisplayProps {
  guests: Guest[];
  onRemoveGuest: (index: number) => void;
  isApproved: boolean;
}

export function GuestListDisplay({ guests, onRemoveGuest, isApproved }: GuestListDisplayProps) {
  if (guests.length === 0) {
    return null;
  }

  return (
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
            onClick={() => onRemoveGuest(index)}
            disabled={!isApproved}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}