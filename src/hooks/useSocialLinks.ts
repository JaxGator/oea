
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
      console.log('Fetching social links...');
      const { data, error } = await supabase
        .from("site_config")
        .select("value")
        .eq("key", "social_links")
        .single();

      if (error) {
        console.error('Error fetching social links:', error);
        throw error;
      }

      console.log('Fetched social links:', data);
      return JSON.parse(data?.value || '{"facebook":"","instagram":"","youtube":""}') as SocialLinks;
    },
  });
};
