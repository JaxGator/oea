
import { supabase } from "@/integrations/supabase/client";
import { validateResponse } from "../utils/test-helpers";
import { TestDefinition } from "../types";

export const eventTests: TestDefinition[] = [
  {
    name: "Event creation structure",
    category: "events",
    run: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .limit(1);
      
      validateResponse({ data, error }, "Event structure test failed");
      
      const requiredFields = [
        'id', 'title', 'description', 'date', 
        'time', 'location', 'max_guests'
      ];
      
      const hasAllFields = requiredFields.every(field => 
        data[0] && field in data[0]
      );
      
      if (!hasAllFields) {
        throw new Error("Events missing required fields");
      }
    }
  },
  {
    name: "RSVP system integrity",
    category: "events",
    run: async () => {
      const { data: rsvps, error } = await supabase
        .from('event_rsvps')
        .select('*')
        .limit(1);
      
      validateResponse({ data: rsvps, error }, "RSVP system test failed");
      
      const requiredFields = ['id', 'event_id', 'user_id', 'response'];
      const hasAllFields = requiredFields.every(field => 
        rsvps[0] && field in rsvps[0]
      );
      
      if (!hasAllFields) {
        throw new Error("RSVP system missing required fields");
      }
    }
  },
  {
    name: "Event date validation",
    category: "events",
    run: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('date')
        .limit(1);
      
      validateResponse({ data, error }, "Event date validation failed");
      
      if (data && data[0]) {
        const date = new Date(data[0].date);
        if (isNaN(date.getTime())) {
          throw new Error("Invalid date format in events table");
        }
      }
    }
  }
];
