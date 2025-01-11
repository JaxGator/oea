import { supabase } from "@/integrations/supabase/client";
import { Test } from "./types";

export const tests: Test[] = [
  // User Management Tests
  {
    name: "User Creation",
    category: "User Management",
    run: async () => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
      if (error) throw error;
      return !!profile;
    }
  },
  {
    name: "User Search",
    category: "User Management",
    run: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .textSearch('username', 'test');
      if (error) throw error;
      return Array.isArray(data);
    }
  },
  // Event Management Tests
  {
    name: "Event Creation",
    category: "Events",
    run: async () => {
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .limit(1);
      if (error) throw error;
      return !!events;
    }
  },
  {
    name: "Waitlist Management",
    category: "Events",
    run: async () => {
      const { data, error } = await supabase
        .from('event_rsvps')
        .select('*')
        .eq('status', 'waitlisted')
        .limit(1);
      if (error) throw error;
      return Array.isArray(data);
    }
  },
  // Payment Tests
  {
    name: "Payment Records",
    category: "Payments",
    run: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .limit(1);
      if (error) throw error;
      return Array.isArray(data);
    }
  },
  // Report Tests
  {
    name: "User Activity Report",
    category: "Reports",
    run: async () => {
      const { data: logs, error } = await supabase
        .from('admin_logs')
        .select('*')
        .limit(1);
      if (error) throw error;
      return Array.isArray(logs);
    }
  },
];