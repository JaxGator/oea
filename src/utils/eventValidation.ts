
import { EventFormValues } from "@/components/event/EventFormTypes";

/**
 * Validates event form data
 * @param formData The form data to validate
 * @throws Error if validation fails
 */
export function validateEventData(formData: EventFormValues): void {
  if (!formData.title) throw new Error('Title is required');
  if (!formData.date) throw new Error('Date is required');
  if (!formData.time) throw new Error('Start time is required');
  if (!formData.location) throw new Error('Location is required');
  if (!formData.max_guests || formData.max_guests < 1) throw new Error('Maximum guests must be at least 1');
}

/**
 * Cleans event form data by normalizing nullable fields
 * @param formData The form data to clean
 * @returns Cleaned form data with properly normalized fields
 */
export function cleanEventData(formData: EventFormValues): EventFormValues {
  return {
    ...formData,
    description: formData.description || null,
    end_time: formData.end_time || null,
    waitlist_capacity: formData.waitlist_enabled ? formData.waitlist_capacity : null,
    latitude: formData.latitude || null,
    longitude: formData.longitude || null
  };
}
