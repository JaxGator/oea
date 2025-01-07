import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SocialFeedForm } from "./SocialFeedForm";

export function SocialFeedManager() {
  // Fetch existing feed configuration
  const { data: existingFeed, refetch } = useQuery({
    queryKey: ['social-feed-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_media_feeds')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Social Media Feed</h3>
        <p className="text-sm text-muted-foreground">
          Configure your social media feed embed code
        </p>
      </div>

      <SocialFeedForm 
        existingFeed={existingFeed}
        onSave={refetch}
      />
    </div>
  );
}