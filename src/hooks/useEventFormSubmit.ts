
import { useState } from 'react';
import { toast } from 'sonner';
import { EventFormValues } from '@/components/event/EventFormTypes';
import { validateEventData, cleanEventData } from '@/utils/eventValidation';
import { createEvent, updateEvent } from '@/services/events/eventDatabaseService';
import { canEditEvent } from '@/utils/permissionsUtils';
import { useAuthState } from '@/hooks/useAuthState';

export function useEventFormSubmit(onSuccess: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthState();
  
  const handleSubmit = async (formData: EventFormValues, initialData?: any) => {
    try {
      setIsSubmitting(true);
      
      if (!user?.id) {
        console.error('User not authenticated');
        toast.error('You must be logged in to save events');
        throw new Error('User not authenticated');
      }
      
      // Clean and validate data
      validateEventData(formData);
      const cleanedData = cleanEventData(formData);
      
      console.log('Processing event submission with data:', cleanedData);
      
      let result;
      
      // Check if this is an update or create operation
      if (initialData?.id) {
        // This is an update operation
        const isAdmin = user.is_admin || false;
        const canManageEvents = isAdmin || user.is_approved;
        
        // Check permissions before attempting update
        if (!canEditEvent(user.id, isAdmin, canManageEvents, initialData.created_by)) {
          console.error('Permission denied: user cannot edit this event', {
            userId: user.id,
            isAdmin,
            canManageEvents,
            eventCreator: initialData.created_by
          });
          toast.error('You do not have permission to edit this event');
          throw new Error('You do not have permission to edit this event');
        }
        
        console.log(`Updating event with ID: ${initialData.id}`, {
          userId: user.id,
          isAdmin,
          canManageEvents,
          hasPermission: true
        });
        
        result = await updateEvent(initialData.id, cleanedData);
      } else {
        // This is a create operation
        console.log('Creating new event');
        result = await createEvent(cleanedData);
      }
      
      if (result.error) {
        console.error('Event save error:', result.error);
        toast.error(result.error.message || 'Failed to save event');
        throw new Error(result.error.message || 'Failed to save event');
      }
      
      toast.success(initialData?.id ? 'Event updated successfully' : 'Event created successfully');
      
      if (onSuccess) {
        onSuccess();
      }
      
      return result.data;
    } catch (error: any) {
      console.error('Event form submission error:', error);
      
      // Provide a more specific error message for permission issues
      const errorMessage = error.message?.includes('permission') 
        ? 'Permission denied: You do not have access to edit this event' 
        : error.message || 'Failed to save event. Please try again.';
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return { handleSubmit, isSubmitting };
}
