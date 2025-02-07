
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useGalleryPreview(limit: number = 6) {
  return useQuery({
    queryKey: ['gallery-preview', limit],
    queryFn: async () => {
      try {
        console.log('Fetching files from gallery bucket...');
        
        // List all files in the gallery bucket
        const { data: files, error: listError } = await supabase.storage
          .from('gallery')
          .list('', {
            limit: limit,
            sortBy: { column: 'name', order: 'desc' }
          });

        if (listError) {
          console.error('Error listing gallery files:', listError);
          throw listError;
        }

        if (!files || files.length === 0) {
          console.log('No files found in gallery');
          return [];
        }

        console.log('Found files in gallery:', files);

        // Get public URLs for each file
        const imageUrls = files
          .filter(file => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) // Only include image files
          .map(file => {
            const { data: urlData } = supabase.storage
              .from('gallery')
              .getPublicUrl(file.name);
            
            console.log('Generated URL for image:', file.name, urlData.publicUrl);
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
