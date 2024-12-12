import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  max_guests: z.number().min(1, "At least one guest is required"),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  onSuccess: () => void;
  initialData?: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    max_guests: number;
  };
}

export function EventForm({ onSuccess, initialData }: EventFormProps) {
  const { toast } = useToast();
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      max_guests: 50,
    },
  });

  const onSubmit = async (data: EventFormValues) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to manage events",
          variant: "destructive",
        });
        return;
      }

      if (initialData) {
        // Update existing event
        const { error } = await supabase
          .from("events")
          .update({
            title: data.title,
            description: data.description,
            date: data.date,
            time: data.time,
            location: data.location,
            max_guests: data.max_guests,
          })
          .eq("id", initialData.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Event updated successfully",
        });
      } else {
        // Create new event
        const { error } = await supabase.from("events").insert({
          title: data.title,
          description: data.description,
          date: data.date,
          time: data.time,
          location: data.location,
          max_guests: data.max_guests,
          created_by: user.id,
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Event created successfully",
        });
      }
      
      onSuccess();
      form.reset();
    } catch (error) {
      console.error("Error managing event:", error);
      toast({
        title: "Error",
        description: "Failed to manage event. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Event description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Event location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="max_guests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Guests</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-[#0d97d1] hover:bg-[#0d97d1]/90">
          {initialData ? "Update Event" : "Create Event"}
        </Button>
      </form>
    </Form>
  );
}