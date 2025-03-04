
import { z } from "zod";

// Basic event details schema
const eventBasicSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  image_url: z.string().url("Please enter a valid image URL").or(z.literal('')),
});

// Event scheduling schema
const eventSchedulingSchema = z.object({
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  end_time: z.string().optional().nullable(),
});

// Event location and capacity schema
const eventLocationSchema = z.object({
  location: z.string().min(1, "Location is required"),
  max_guests: z.number().min(1, "At least one guest is required"),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
});

// Event reminder settings schema
const eventReminderSchema = z.object({
  reminder_enabled: z.boolean().default(false),
  reminder_intervals: z.array(z.string()).default(["7d", "1d", "1h"]),
});

// Event waitlist settings schema
const eventWaitlistSchema = z.object({
  waitlist_enabled: z.boolean().default(false),
  waitlist_capacity: z.number().nullable().default(null),
});

// Admin settings schema
const eventAdminSchema = z.object({
  is_featured: z.boolean().default(false),
});

// Metadata schema
const eventMetadataSchema = z.object({
  created_by: z.string().nonempty("User ID is required"),
});

// Combine all schemas into one event schema
export const eventSchema = eventBasicSchema
  .merge(eventSchedulingSchema)
  .merge(eventLocationSchema)
  .merge(eventReminderSchema)
  .merge(eventWaitlistSchema)
  .merge(eventAdminSchema)
  .merge(eventMetadataSchema);

// Extract types from schemas
export type EventBasicDetails = z.infer<typeof eventBasicSchema>;
export type EventSchedulingDetails = z.infer<typeof eventSchedulingSchema>;
export type EventLocationDetails = z.infer<typeof eventLocationSchema>;
export type EventReminderSettings = z.infer<typeof eventReminderSchema>;
export type EventWaitlistSettings = z.infer<typeof eventWaitlistSchema>;
export type EventAdminSettings = z.infer<typeof eventAdminSchema>;
export type EventMetadata = z.infer<typeof eventMetadataSchema>;

// Main form values type (complete event data)
export type EventFormValues = z.infer<typeof eventSchema>;

// Form data interface with optional ID for existing events
export interface EventFormData {
  id?: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  end_time?: string | null;
  location: string;
  max_guests: number;
  image_url: string;
  reminder_enabled?: boolean;
  reminder_intervals?: string[];
  waitlist_enabled?: boolean;
  waitlist_capacity?: number | null;
  is_featured?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  created_by: string;
}

// Props for the EventForm component
export interface EventFormProps {
  onSuccess: () => void;
  initialData?: EventFormData;
  isPastEvent?: boolean;
  isWixEvent?: boolean;
  forceAdmin?: boolean;
  forceCanManage?: boolean;
}

// Helper function to extract basic details from form values
export function extractBasicDetails(values: EventFormValues): EventBasicDetails {
  return {
    title: values.title,
    description: values.description,
    image_url: values.image_url,
  };
}

// Helper function to extract scheduling details from form values
export function extractSchedulingDetails(values: EventFormValues): EventSchedulingDetails {
  return {
    date: values.date,
    time: values.time,
    end_time: values.end_time,
  };
}

// Helper function to extract location details from form values
export function extractLocationDetails(values: EventFormValues): EventLocationDetails {
  return {
    location: values.location,
    max_guests: values.max_guests,
    latitude: values.latitude,
    longitude: values.longitude,
  };
}

// Helper function to extract reminder settings from form values
export function extractReminderSettings(values: EventFormValues): EventReminderSettings {
  return {
    reminder_enabled: values.reminder_enabled,
    reminder_intervals: values.reminder_intervals,
  };
}

// Helper function to extract waitlist settings from form values
export function extractWaitlistSettings(values: EventFormValues): EventWaitlistSettings {
  return {
    waitlist_enabled: values.waitlist_enabled,
    waitlist_capacity: values.waitlist_capacity,
  };
}

// Helper function to extract admin settings from form values
export function extractAdminSettings(values: EventFormValues): EventAdminSettings {
  return {
    is_featured: values.is_featured,
  };
}
