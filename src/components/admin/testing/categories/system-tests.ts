import { supabase } from "@/integrations/supabase/client";
import { validateResponse } from "../utils/test-helpers";
import { TestDefinition } from "../types";

export const systemTests: TestDefinition[] = [
  {
    name: "Database connection",
    category: "admin",
    run: async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);
          
        validateResponse({ data, error }, "Database connection test failed");
      } catch (error) {
        throw new Error(`Database connection failed: ${error.message}`);
      }
    }
  },
  {
    name: "Storage bucket accessibility",
    category: "admin",
    run: async () => {
      try {
        const { data, error } = await supabase
          .storage
          .listBuckets();
          
        validateResponse({ data, error }, "Storage bucket test failed");
        
        if (!data.some(bucket => bucket.name === 'media')) {
          throw new Error("Required storage bucket 'media' not found");
        }
      } catch (error) {
        throw new Error(`Storage bucket test failed: ${error.message}`);
      }
    }
  }
];