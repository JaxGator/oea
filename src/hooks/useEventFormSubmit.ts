
import { useState } from "react";
import { EventFormValues } from "@/components/event/EventFormTypes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAdminStatus } from "@/hooks/events/useAdminStatus";
import { useAuthState } from "@/hooks/useAuthState";
import { useQueryClient } from "@tanstack/react-query";

async function geocodeLocation(location: string) {
  try {
    const { data: { token }, error: tokenError } = await supabase.functions.invoke('get-mapbox-token');
    
    if (tokenError) {
      console.error('Error getting Mapbox token:', tokenError);
      return null;
    }

    const query = encodeURIComponent(location);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}`
    );
    
    if (!response.ok) {
      console.error('Geocoding fetch error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      return { latitude, longitude };
    }
    
    console.log('No geocoding results found for:', location);
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
  const queryClient = useQueryClient();

  const handleSubmit = async (formData: EventFormValues, initialData?: any) => {
    // Prevent duplicate submissions
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      console.log('Event submission - Form data:', formData);
      console.log('Event submission - User status:', { 
        userId: user?.id,
        isAdmin,
        canManageEvents,
        isUpdating: !!initialData?.id,
        eventCreator: initialData?.created_by
      });

      if (!user?.id) {
        throw new Error('You must be logged in to create or edit an event');
      }

      // Check if user is allowed to update this event
      if (initialData?.id) {
        const canEdit = isAdmin || canManageEvents || initialData.created_by === user?.id;
        console.log('Checking edit permissions:', {
          isAdmin,
          canManageEvents,
          eventCreatedBy: initialData.created_by,
          currentUserId: user?.id,
          canEdit
        });
        
        if (!canEdit) {
          throw new Error('You do not have permission to edit this event');
        }
      }

      // Validate required fields
      if (!formData.title) throw new Error('Title is required');
      if (!formData.date) throw new Error('Date is required');
      if (!formData.time) throw new Error('Start time is required');
      if (!formData.location) throw new Error('Location is required');
      if (!formData.max_guests || formData.max_guests < 1) throw new Error('Maximum guests must be at least 1');

      // Clean up the form data - handle nullable fields properly
      const cleanedData = {
        ...formData,
        description: formData.description || null,
        end_time: formData.end_time || null,
        waitlist_capacity: formData.waitlist_enabled ? formData.waitlist_capacity : null,
        latitude: formData.latitude || null,
        longitude: formData.longitude || null
      };

      // Only geocode if location has changed
      let coordinates = null;
      if (!initialData || initialData.location !== cleanedData.location) {
        console.log('Geocoding location:', cleanedData.location);
        coordinates = await geocodeLocation(cleanedData.location);
        console.log('Geocoding result:', coordinates);
      }
      
      // Prepare event data
      const eventData = {
        title: cleanedData.title,
        description: cleanedData.description,
        date: cleanedData.date,
        time: cleanedData.time,
        end_time: cleanedData.end_time,
        location: cleanedData.location,
        max_guests: cleanedData.max_guests,
        image_url: cleanedData.image_url || "/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png", // Ensure default image
        waitlist_enabled: cleanedData.waitlist_enabled,
        waitlist_capacity: cleanedData.waitlist_capacity,
        reminder_enabled: cleanedData.reminder_enabled,
        reminder_intervals: cleanedData.reminder_intervals,
        is_featured: isAdmin ? cleanedData.is_featured : (initialData?.is_featured || false),
        is_published: initialData?.is_published ?? true,
        ...(coordinates && {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude
        }),
        ...(initialData?.latitude && !coordinates && {
          latitude: initialData.latitude,
          longitude: initialData.longitude
        }),
        created_by: cleanedData.created_by || user.id
      };

      console.log('Event data to be saved:', eventData);
      console.log('Is update operation:', !!initialData?.id);

      if (initialData?.id) {
        console.log('Updating event with ID:', initialData.id);

        // Update existing event
        const { data: updateData, error: updateError } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', initialData.id)
          .select();

        if (updateError) {
          console.error('Event update error:', updateError);
          throw new Error(`Failed to update event: ${updateError.message}`);
        }
        
        console.log('Update response:', updateData);
        
        // Force invalidation of all event-related caches
        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({ queryKey: ['event', initialData.id] });
        queryClient.invalidateQueries({ queryKey: ['featuredEvents'] });
        
        toast.success('Event updated successfully');
        
        // Call the success callback
        if (onSuccess) onSuccess();
      } else {
        // Insert new event
        console.log('Creating new event with data:', {
          ...eventData,
          created_by: user.id
        });
        
        const { data: insertData, error: insertError } = await supabase
          .from('events')
          .insert([{
            ...eventData,
            created_by: user.id
          }])
          .select();

        if (insertError) {
          console.error('Event creation error:', insertError);
          throw new Error(`Failed to create event: ${insertError.message}`);
        }
        
        console.log('Insert response:', insertData);
        
        if (!insertData || insertData.length === 0) {
          console.error('Event creation returned no data');
          throw new Error('Failed to create event - no data returned');
        }
        
        // Force invalidation of all event-related caches
        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({ queryKey: ['featuredEvents'] });
        
        toast.success('Event created successfully');
        
        // Call the success callback
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      console.error('Error submitting event:', error);
      toast.error(error.message || 'Failed to save event');
      throw error; // Re-throw to allow the form component to handle it
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
}
