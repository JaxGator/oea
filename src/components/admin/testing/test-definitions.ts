import { supabase } from "@/integrations/supabase/client";

interface TestDefinition {
  name: string;
  category: 'auth' | 'events' | 'members' | 'content' | 'admin' | 'navigation' | 'ui';
  run: () => Promise<void>;
}

// Helper function to validate response
const validateResponse = (response: any, message: string) => {
  if (!response || response.error) {
    throw new Error(`${message}: ${response?.error?.message || 'Unknown error'}`);
  }
  return response;
};

export const tests: TestDefinition[] = [
  // Authentication Tests
  {
    name: "Public routes accessibility",
    category: "auth",
    run: async () => {
      const publicRoutes = ['/', '/about', '/events', '/resources'];
      // Verify routes exist in App.tsx
      const routeCheck = publicRoutes.every(route => 
        document.querySelector(`a[href="${route}"]`)
      );
      if (!routeCheck) {
        throw new Error("Some public routes are not accessible");
      }
    }
  },
  {
    name: "Profile data structure",
    category: "auth",
    run: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
      
      validateResponse({ data, error }, "Profile structure test failed");
      
      const requiredFields = ['id', 'username', 'is_admin', 'is_approved'];
      const hasAllFields = requiredFields.every(field => 
        data[0] && field in data[0]
      );
      
      if (!hasAllFields) {
        throw new Error("Profile missing required fields");
      }
    }
  },

  // Events Tests
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

  // Members Tests
  {
    name: "Member list accessibility",
    category: "members",
    run: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, is_approved')
        .eq('is_approved', true)
        .limit(1);
      
      validateResponse({ data, error }, "Member list test failed");
    }
  },

  // Content Tests
  {
    name: "Page content integrity",
    category: "content",
    run: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .limit(1);
      
      validateResponse({ data, error }, "Content integrity test failed");
      
      const requiredFields = ['id', 'page_id', 'section_id', 'content'];
      const hasAllFields = requiredFields.every(field => 
        data[0] && field in data[0]
      );
      
      if (!hasAllFields) {
        throw new Error("Page content missing required fields");
      }
    }
  },

  // Admin Tests
  {
    name: "Admin privileges verification",
    category: "admin",
    run: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('is_admin', true)
        .limit(1);
      
      validateResponse({ data, error }, "Admin privileges test failed");
    }
  },

  // Navigation Tests
  {
    name: "Navigation menu structure",
    category: "navigation",
    run: async () => {
      const navElement = document.querySelector('nav[role="navigation"]');
      if (!navElement) {
        throw new Error("Navigation structure not found");
      }
    }
  },

  // UI Tests
  {
    name: "Responsive design breakpoints",
    category: "ui",
    run: async () => {
      const breakpoints = {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280
      };
      
      // Verify Tailwind classes are applied
      const hasBreakpoints = Object.keys(breakpoints).some(breakpoint => 
        document.querySelector(`[class*="${breakpoint}:"]`)
      );
      
      if (!hasBreakpoints) {
        throw new Error("Responsive design breakpoints not implemented");
      }
    }
  }
];