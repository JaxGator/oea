
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useGalleryPreview(limit: number = 6) {
  return useQuery({
    queryKey: ['gallery-preview'],
    queryFn: async () => {
      try {
        const { data: files, error } = await supabase.storage
          .from('gallery')
          .list('', {
            limit,
            sortBy: { column: 'name', order: 'desc' }
          });

        if (error) throw error;

        if (!files || files.length === 0) {
          return [];
        }

        // Filter image files and get public URLs in one go
        return files
          .filter(file => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
          .map(file => supabase.storage
            .from('gallery')
            .getPublicUrl(file.name)
            .data.publicUrl
          );
      } catch (error) {
        toast.error('Failed to load gallery images');
        throw error;
      }
    },
    refetchOnWindowFocus: false
  });
}
