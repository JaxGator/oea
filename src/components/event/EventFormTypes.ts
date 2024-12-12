import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  max_guests: z.number().min(1, "At least one guest is required"),
  image_url: z.string().url("Please enter a valid image URL"),
});

export type EventFormValues = z.infer<typeof eventSchema>;

export interface EventFormProps {
  onSuccess: () => void;
  initialData?: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    max_guests: number;
    image_url?: string;
  };
}