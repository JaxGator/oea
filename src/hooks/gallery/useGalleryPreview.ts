import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useGalleryPreview(limit: number = 6) {
  return useQuery({
    queryKey: ['gallery-preview', limit],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('gallery_images')
          .select('*')
          .order('display_order', { ascending: true })
          .limit(limit);

        if (error) {
          console.error('Error fetching gallery images:', error);
          toast.error('Failed to load gallery images');
          throw error;
        }

        if (!data) return [];

        return data.map(image => {
          const { data: urlData } = supabase.storage
            .from('gallery')
            .getPublicUrl(image.file_name);
          return urlData.publicUrl;
        });
      } catch (error) {
        console.error('Gallery fetch error:', error);
        toast.error('Failed to load gallery images');
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  });
}