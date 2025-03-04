
import { supabase } from "@/integrations/supabase/client";
import { EventFormValues } from "@/components/event/EventFormTypes";
import { geocodeAddress } from "../geocoding/geocodingService";

/**
 * Creates a new event in the database
 * @param eventData The event data to save
 * @returns The result of the database operation
 */
export async function createEvent(eventData: EventFormValues) {
  try {
    // Try to geocode the address if not already done
    if (eventData.location && (!eventData.latitude || !eventData.longitude)) {
      const geoData = await geocodeAddress(eventData.location);
      
      if (geoData?.latitude && geoData?.longitude) {
        eventData.latitude = geoData.latitude;
        eventData.longitude = geoData.longitude;
      }
    }
    
    // Insert the event into the database
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();
      
    if (error) {
      console.error('Database error creating event:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating event:', error);
    return { 
      data: null, 
      error: { message: 'Failed to create event in the database' } 
    };
  }
}

/**
 * Updates an existing event in the database
 * @param eventId The ID of the event to update
 * @param eventData The updated event data
 * @returns The result of the database operation
 */
export async function updateEvent(eventId: string, eventData: EventFormValues) {
  try {
    // Try to geocode the address if it has changed
    if (eventData.location && (!eventData.latitude || !eventData.longitude)) {
      const geoData = await geocodeAddress(eventData.location);
      
      if (geoData?.latitude && geoData?.longitude) {
        eventData.latitude = geoData.latitude;
        eventData.longitude = geoData.longitude;
      }
    }
    
    // Update the event in the database
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', eventId)
      .select()
      .single();
      
    if (error) {
      console.error('Database error updating event:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error updating event:', error);
    return { 
      data: null, 
      error: { message: 'Failed to update event in the database' } 
    };
  }
}
