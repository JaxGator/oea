
import { EventFormProps } from "../EventFormTypes";
import { EventFormSubmitButton } from "./EventFormSubmitButton";
import { useEventFormSubmission } from "@/hooks/events/useEventFormSubmission";
import { useFormState } from "./useFormState";
import { Profile } from "@/types/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EventFormContentProps extends EventFormProps {
  user: Profile | null;
  hasPermissionToEdit: boolean;
  isVerifyingPermission: boolean;
}

export function EventFormContent({
  initialData,
  onSuccess,
  user,
  hasPermissionToEdit,
  isVerifyingPermission,
  forceAdmin,
  forceCanManage
}: EventFormContentProps) {
  const { form, formFields } = useFormState(initialData);
  
  const {
    onSubmit,
    isSubmitting,
    effectiveIsAdmin,
    effectiveCanManage,
    permissionError
  } = useEventFormSubmission({
    onSuccess,
    initialData,
    user,
    hasPermissionToEdit,
    forceAdmin,
    forceCanManage
  });
  
  // Handle form submission
  const handleSubmit = form.handleSubmit(onSubmit);
  
  return (
    <div className="space-y-4">
      {permissionError && (
        <Alert variant="destructive">
          <AlertDescription>{permissionError}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {formFields}
        
        <EventFormSubmitButton
          isSubmitting={isSubmitting}
          isVerifyingPermission={isVerifyingPermission}
          initialData={initialData}
          showPermissionWarning={!hasPermissionToEdit && !!initialData?.id}
          permissionError={permissionError}
        />
      </form>
    </div>
  );
}
