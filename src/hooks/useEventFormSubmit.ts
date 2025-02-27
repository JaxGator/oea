
import { useState } from "react";
import { EventFormValues } from "@/components/event/EventFormTypes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAdminStatus } from "@/hooks/events/useAdminStatus";
import { useAuthState } from "@/hooks/useAuthState";
import { executeQuery } from "@/utils/database";

async function geocodeLocation(location: string) {
  try {
    const { data: { token }, error: tokenError } = await supabase.functions.invoke('get-mapbox-token');
    
    if (tokenError) throw tokenError;

    const query = encodeURIComponent(location);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      return { latitude, longitude };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

export function useEventFormSubmit(onSuccess: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAdmin, canManageEvents } = useAdminStatus();
  const { user } = useAuthState();

  const handleSubmit = async (formData: EventFormValues, initialData?: any) => {
    // Prevent duplicate submissions
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      console.log('Event submission - User status:', { 
        userId: user?.id,
        isAdmin,
        canManageEvents,
        isUpdating: !!initialData?.id,
        eventCreator: initialData?.created_by,
        isCreator: initialData?.created_by === user?.id
      });

      // Clean up the form data
      const cleanedData = {
        ...formData,
        end_time: formData.end_time || null,
        time: formData.time || null
      };

      // Validate required time field
      if (!cleanedData.time) {
        throw new Error('Start time is required');
      }

      // Only geocode if location has changed
      let coordinates = null;
      if (!initialData || initialData.location !== cleanedData.location) {
        coordinates = await geocodeLocation(cleanedData.location);
      }
      
      const eventData = {
        ...cleanedData,
        ...(coordinates && {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude
        })
      };

      // Preserve the original created_by field when updating
      if (initialData?.id) {
        // Make sure we don't change the creator when updating
        eventData.created_by = initialData.created_by;
      }

      console.log('Event data to be saved:', {
        isUpdate: !!initialData?.id,
        eventId: initialData?.id,
        createdBy: eventData.created_by
      });

      if (initialData?.id) {
        // Check if user is allowed to update this event
        if (!isAdmin && !canManageEvents && initialData.created_by !== user?.id) {
          throw new Error('You do not have permission to edit this event');
        }

        // Use a more basic update approach to avoid RLS issues
        const { error: updateError } = await supabase
          .from('events')
          .update({
            title: eventData.title,
            description: eventData.description,
            date: eventData.date,
            time: eventData.time,
            end_time: eventData.end_time,
            location: eventData.location,
            max_guests: eventData.max_guests,
            image_url: eventData.image_url,
            waitlist_enabled: eventData.waitlist_enabled,
            waitlist_capacity: eventData.waitlist_capacity,
            reminder_enabled: eventData.reminder_enabled,
            reminder_intervals: eventData.reminder_intervals,
            is_featured: isAdmin ? eventData.is_featured : initialData.is_featured,
            ...(eventData.latitude && { latitude: eventData.latitude }),
            ...(eventData.longitude && { longitude: eventData.longitude })
          })
          .eq('id', initialData.id);

        if (updateError) {
          console.error('Event update error:', updateError);
          throw updateError;
        }
        
        console.log('Event updated successfully:', initialData.id);
        toast.success('Event updated successfully');
      } else {
        // For new events, set the creator to the current user
        eventData.created_by = user?.id;
        
        const { data: insertData, error: insertError } = await supabase
          .from('events')
          .insert([eventData])
          .select();

        if (insertError) {
          console.error('Event creation error:', insertError);
          throw insertError;
        }
        
        if (!insertData || insertData.length === 0) {
          console.error('Event creation returned no data');
          throw new Error('Failed to create event - no data returned');
        }
        
        console.log('Event created successfully:', insertData);
        toast.success('Event created successfully');
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error submitting event:', error);
      toast.error(error.message || 'Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
}
