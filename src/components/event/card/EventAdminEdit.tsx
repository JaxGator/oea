import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";

interface EventAdminEditProps {
  isAdmin: boolean;
  isPastEvent: boolean;
  editedRSVPCount: string;
  isEditingRSVP: boolean;
  onEditRSVP: () => void;
  onSaveRSVP: () => void;
  onCancelEdit: () => void;
  onRSVPCountChange: (value: string) => void;
}

export function EventAdminEdit({
  isAdmin,
  isPastEvent,
  editedRSVPCount,
  isEditingRSVP,
  onEditRSVP,
  onSaveRSVP,
  onCancelEdit,
  onRSVPCountChange,
}: EventAdminEditProps) {
  if (!isAdmin || !isPastEvent) return null;

  return (
    <div className="mt-2 mb-4">
      {isEditingRSVP ? (
        <div className="flex gap-2">
          <Input
            type="number"
            value={editedRSVPCount}
            onChange={(e) => onRSVPCountChange(e.target.value)}
            className="w-24"
            min="0"
          />
          <Button size="sm" onClick={onSaveRSVP}>
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={onCancelEdit}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={onEditRSVP}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit RSVP Count
        </Button>
      )}
    </div>
  );
}