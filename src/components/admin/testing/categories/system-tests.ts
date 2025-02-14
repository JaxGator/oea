
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
  },
  {
    name: "Site configuration availability",
    category: "system",
    run: async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('*')
          .limit(1);
        
        validateResponse({ data, error }, "Site configuration test failed");
      } catch (error) {
        throw new Error(`Site configuration test failed: ${error.message}`);
      }
    }
  },
  {
    name: "Events table structure",
    category: "system",
    run: async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .limit(1);
        
        validateResponse({ data, error }, "Events table structure test failed");
        
        if (data && data[0]) {
          const requiredFields = ['id', 'title', 'description', 'date', 'created_at'];
          const missingFields = requiredFields.filter(field => !(field in data[0]));
          
          if (missingFields.length > 0) {
            throw new Error(`Missing required fields in events table: ${missingFields.join(', ')}`);
          }
        }
      } catch (error) {
        throw new Error(`Events table test failed: ${error.message}`);
      }
    }
  }
];
