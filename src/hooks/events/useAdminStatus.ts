import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAdminStatus() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      setIsAdmin(!!data?.is_admin);
    }
  };

  return { isAdmin };
}