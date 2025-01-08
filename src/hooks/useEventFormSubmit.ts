import { useNavigate } from "react-router-dom";
import { EventFormValues } from "@/components/event/EventFormTypes";
import { validateUserPermissions, createEventData, updateEvent, createEvent } from "@/utils/eventUtils";
import { toast } from "@/hooks/use-toast";

export const useEventFormSubmit = (onSuccess: () => void) => {
  const navigate = useNavigate();

  const handleSubmit = async (data: EventFormValues, initialData?: { id: string }) => {
    try {
      const profile = await validateUserPermissions();
      if (!profile) {
        navigate("/auth");
        return;
      }

      const eventData = createEventData(data);

      if (initialData?.id) {
        await updateEvent(initialData.id, eventData);
      } else {
        await createEvent(eventData, profile.id);
      }
      
      onSuccess();
    } catch (error: any) {
      console.error("Error managing event:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to manage event. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { handleSubmit };
};