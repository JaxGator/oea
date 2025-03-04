
import { Button } from "@/components/ui/button";

interface EventFormSubmitButtonProps {
  isSubmitting: boolean;
  initialData?: any;
  showPermissionWarning: boolean;
}

export function EventFormSubmitButton({ 
  isSubmitting, 
  initialData, 
  showPermissionWarning 
}: EventFormSubmitButtonProps) {
  return (
    <Button 
      type="submit" 
      className="w-full bg-[#0d97d1] hover:bg-[#0d97d1]/90"
      disabled={isSubmitting || showPermissionWarning}
    >
      {isSubmitting ? 
        (initialData ? "Updating Event..." : "Creating Event...") : 
        (initialData ? "Update Event" : "Create Event")}
    </Button>
  );
}
