import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SocialLinks = {
  facebook: string;
  instagram: string;
  youtube: string;
};

export const useSocialLinks = () => {
  return useQuery({
    queryKey: ["social-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_config")
        .select("value")
        .eq("key", "social_links")
        .single();

      if (error) throw error;

      return JSON.parse(data.value || '{"facebook":"","instagram":"","youtube":""}') as SocialLinks;
    },
  });
};