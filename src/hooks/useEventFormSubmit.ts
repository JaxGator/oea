import { useState } from "react";
import { EventFormValues } from "@/components/event/EventFormTypes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  const handleSubmit = async (formData: EventFormValues, initialData?: any) => {
    try {
      setIsSubmitting(true);

      // Clean up the form data
      const cleanedData = {
        ...formData,
        end_time: formData.end_time || null, // Convert empty string to null
        time: formData.time || null // Ensure time is not empty
      };

      // Validate required time field
      if (!cleanedData.time) {
        throw new Error('Start time is required');
      }

      // Geocode the location
      const coordinates = await geocodeLocation(cleanedData.location);
      
      const eventData = {
        ...cleanedData,
        ...(coordinates && {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude
        })
      };

      if (initialData?.id) {
        const { error: updateError } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', initialData.id);

        if (updateError) throw updateError;
        toast.success('Event updated successfully');
      } else {
        const { error: insertError } = await supabase
          .from('events')
          .insert([eventData]);

        if (insertError) throw insertError;
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