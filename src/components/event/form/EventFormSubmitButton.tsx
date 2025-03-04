
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { LoadingButton } from "@/components/ui/loading-button";

interface EventFormSubmitButtonProps {
  isSubmitting: boolean;
  isVerifyingPermission?: boolean;
  initialData?: any;
  showPermissionWarning?: boolean;
}

export function EventFormSubmitButton({
  isSubmitting,
  isVerifyingPermission = false,
  initialData,
  showPermissionWarning = false
}: EventFormSubmitButtonProps) {
  return (
    <div className="flex justify-end mt-4">
      <LoadingButton 
        type="submit"
        isLoading={isSubmitting}
        loadingText="Saving..."
        isVerifyingPermission={isVerifyingPermission}
        permissionDenied={showPermissionWarning}
        permissionMessage="You don't have permission to edit this event"
        className="gap-2"
      >
        {initialData?.id ? 'Update Event' : 'Create Event'}
      </LoadingButton>
    </div>
  );
}
