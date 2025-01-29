import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useGalleryPreview(limit: number = 6) {
  return useQuery({
    queryKey: ['gallery-preview', limit],
    queryFn: async () => {
      try {
        console.log('Fetching gallery preview images...');
        const { data, error } = await supabase
          .from('gallery_images')
          .select('*')
          .order('display_order', { ascending: true })
          .limit(limit);

        if (error) {
          console.error('Error fetching gallery images:', error);
          throw error;
        }

        console.log('Fetched gallery data:', data);

        if (!data) return [];

        const imageUrls = data.map(image => {
          const { data: urlData } = supabase.storage
            .from('gallery')
            .getPublicUrl(image.file_name);
          
          console.log('Generated URL for image:', image.file_name, urlData.publicUrl);
          return urlData.publicUrl;
        });

        console.log('Final image URLs:', imageUrls);
        return imageUrls;
      } catch (error) {
        console.error('Gallery preview error:', error);
        toast.error('Failed to load gallery images');
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  });
}