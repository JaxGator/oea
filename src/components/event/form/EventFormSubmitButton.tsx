
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { LoadingButton } from "@/components/ui/loading-button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EventFormSubmitButtonProps {
  isSubmitting: boolean;
  isVerifyingPermission?: boolean;
  initialData?: any;
  showPermissionWarning?: boolean;
  permissionError?: string | null;
}

export function EventFormSubmitButton({
  isSubmitting,
  isVerifyingPermission = false,
  initialData,
  showPermissionWarning = false,
  permissionError = null
}: EventFormSubmitButtonProps) {
  return (
    <div className="space-y-4">
      {(showPermissionWarning || permissionError) && (
        <Alert variant="warning">
          <AlertDescription>
            {permissionError || "You don't have permission to edit this event"}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-end">
        <LoadingButton 
          type="submit"
          isLoading={isSubmitting}
          loadingText="Saving..."
          isVerifyingPermission={isVerifyingPermission}
          permissionDenied={showPermissionWarning}
          permissionMessage={permissionError || "You don't have permission to edit this event"}
          className="gap-2"
        >
          {initialData?.id ? 'Update Event' : 'Create Event'}
        </LoadingButton>
      </div>
    </div>
  );
}
