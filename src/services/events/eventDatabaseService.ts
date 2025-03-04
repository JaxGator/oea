
import { supabase } from "@/integrations/supabase/client";
import { EventFormValues } from "@/components/event/EventFormTypes";

interface EventOperationResult {
  success: boolean;
  data?: any;
  error?: Error;
}

/**
 * Creates a new event in the database
 * @param eventData The event data to create
 * @returns Promise resolving to the operation result
 */
export async function createEvent(eventData: any): Promise<EventOperationResult> {
  try {
    console.log('Creating new event with data:', eventData);
    
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select();

    if (error) {
      console.error('Event creation error:', error);
      return { 
        success: false, 
        error: new Error(`Failed to create event: ${error.message}`) 
      };
    }
    
    if (!data || data.length === 0) {
      console.error('Event creation returned no data');
      return { 
        success: false, 
        error: new Error('Failed to create event - no data returned') 
      };
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Error creating event:', error);
    return { 
      success: false, 
      error: new Error(error.message || 'Unknown error creating event') 
    };
  }
}

/**
 * Updates an existing event in the database
 * @param eventId The ID of the event to update
 * @param eventData The updated event data
 * @returns Promise resolving to the operation result
 */
export async function updateEvent(eventId: string, eventData: any): Promise<EventOperationResult> {
  try {
    console.log('Updating event with ID:', eventId);
    
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', eventId)
      .select();

    if (error) {
      console.error('Event update error:', error);
      return { 
        success: false, 
        error: new Error(`Failed to update event: ${error.message}`) 
      };
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Error updating event:', error);
    return { 
      success: false, 
      error: new Error(error.message || 'Unknown error updating event') 
    };
  }
}
