
import { supabase } from "@/integrations/supabase/client";
import { validateResponse } from "../utils/test-helpers";
import { TestDefinition } from "../types";

export const authTests: TestDefinition[] = [
  {
    name: "Public routes accessibility",
    category: "auth",
    run: async () => {
      const publicRoutes = ['/', '/about', '/events', '/resources'];
      const nav = document.querySelector('nav');
      if (!nav) {
        throw new Error("Navigation not found");
      }
      
      const links = Array.from(nav.querySelectorAll('a'));
      const routeCheck = publicRoutes.every(route => 
        links.some(link => link.getAttribute('href') === route)
      );
      
      if (!routeCheck) {
        throw new Error("Some public routes are not accessible in navigation");
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
  {
    name: "Auth session handling",
    category: "auth",
    run: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        throw new Error(`Session handling test failed: ${error.message}`);
      }
      
      // This should not throw an error whether logged in or not
      validateResponse({ data: session, error }, "Session handling test failed");
    }
  }
];
