
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthState } from "@/hooks/useAuthState";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [isSessionChecking, setIsSessionChecking] = useState(true);
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const buttonText = getButtonText(isSubmitting, initialData);
  
  // Double-check the session status to be extra sure
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setHasActiveSession(!!data.session);
        setIsSessionChecking(false);
      } catch (error) {
        console.error("Session check error:", error);
        setIsSessionChecking(false);
      }
    };
    
    checkSession();
  }, []);
  
  // Show loading state while checking session
  if (isSessionChecking) {
    return (
      <Button disabled className="w-full">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Checking authentication...
      </Button>
    );
  }
  
  // If user is not authenticated, show auth required message instead of submit button
  if (!isAuthenticated && !hasActiveSession) {
    return (
      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertDescription className="text-yellow-800">
          Please <a href="/auth" className="underline font-semibold">sign in</a> to create or edit events.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-4">
      {showPermissionWarning && (
        <Alert variant="warning">
          <AlertDescription>
            You don't have permission to edit this event. Only admins, approved members, and the event creator can make changes.
          </AlertDescription>
        </Alert>
      )}
      
      <Button 
        type="submit" 
        className="w-full"
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
