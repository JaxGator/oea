import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

export function BulkUserCreation() {
  return null; // Component no longer automatically processes users
}