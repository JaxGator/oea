
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { GuestInput } from "@/components/event/guest/GuestInput";
import { GuestListDisplay } from "@/components/event/guest/GuestListDisplay";

interface GuestManagementProps {
  guests: { firstName: string }[];
  currentGuests: { firstName: string }[];
  onAddGuest: (firstName: string) => void;
  onRemoveGuest: (index: number) => void;
  onCancel: () => void;
  onSave: () => void;
  isSubmitting: boolean;
}

export function GuestManagement({
  guests,
  currentGuests,
  onAddGuest,
  onRemoveGuest,
  onCancel,
  onSave,
  isSubmitting
}: GuestManagementProps) {
  return (
    <div className="space-y-3 p-3 border rounded-md bg-gray-50">
      <h4 className="text-sm font-medium">Add Guests</h4>
      
      {guests.length > 0 && (
        <GuestListDisplay 
          guests={guests} 
          onRemoveGuest={onRemoveGuest}
          isApproved={true} 
        />
      )}
      
      <GuestInput 
        onAddGuest={onAddGuest}
        isApproved={true}
      />
      
      <div className="flex gap-2 justify-end mt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        
        <LoadingButton 
          size="sm" 
          onClick={onSave}
          isLoading={isSubmitting}
        >
          {guests.length > currentGuests.length
            ? `Save ${guests.length - currentGuests.length} New Guests`
            : "Update Guests"}
        </LoadingButton>
      </div>
    </div>
  );
}
