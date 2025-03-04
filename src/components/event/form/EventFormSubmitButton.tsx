
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthState } from "@/hooks/useAuthState";

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
  const { isAuthenticated } = useAuthState();
  const buttonText = getButtonText(isSubmitting, initialData);
  
  // If user is not authenticated, show auth required message instead of submit button
  if (!isAuthenticated) {
    return (
      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertDescription className="text-yellow-800">
          Please sign in to create or edit events.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-4">
      {showPermissionWarning && (
        <Alert variant="destructive">
          <AlertDescription>
            You don't have permission to edit this event. Only admins, approved members, and the event creator can make changes.
          </AlertDescription>
        </Alert>
      )}
      
      <Button 
        type="submit" 
        className="w-full bg-[#0d97d1] hover:bg-[#0d97d1]/90"
        disabled={isSubmitting || showPermissionWarning}
      >
        {isSubmitting && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {buttonText}
      </Button>
    </div>
  );
}

function getButtonText(isSubmitting: boolean, initialData?: any): string {
  if (isSubmitting) {
    return initialData ? "Updating Event..." : "Creating Event...";
  } else {
    return initialData ? "Update Event" : "Create Event";
  }
}
