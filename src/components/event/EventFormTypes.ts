
import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  end_time: z.string().optional().nullable(),
  location: z.string().min(1, "Location is required"),
  max_guests: z.number().min(1, "At least one guest is required"),
  image_url: z.string().url("Please enter a valid image URL").or(z.literal('')),
  reminder_enabled: z.boolean().default(false),
  reminder_intervals: z.array(z.string()).default(["7d", "1d", "1h"]),
  waitlist_enabled: z.boolean().default(false),
  waitlist_capacity: z.number().nullable().default(null),
  is_featured: z.boolean().default(false),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  created_by: z.string().nonempty("User ID is required"),
});

export type EventFormValues = z.infer<typeof eventSchema>;

export interface EventFormData {
  id: string;
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

export interface EventFormProps {
  onSuccess: () => void;
  initialData?: EventFormData;
  isPastEvent?: boolean;
  isWixEvent?: boolean;
  forceAdmin?: boolean;
  forceCanManage?: boolean;
}
