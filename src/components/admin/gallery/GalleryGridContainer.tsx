import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GalleryItem } from "./GalleryItem";
import { toast } from "@/hooks/use-toast";

interface GalleryGridContainerProps {
  images: Array<{ url: string; id: string }>;
  onImageDelete: (imageUrl: string) => void;
}

export function GalleryGridContainer({ images, onImageDelete }: GalleryGridContainerProps) {
  const [publicUrls, setPublicUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const getPublicUrls = () => {
      const urlMap: Record<string, string> = {};
      
      images.forEach(image => {
        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(image.url.split('/').pop()?.split('?')[0] || '');
          
        urlMap[image.id] = publicUrl;
      });
      
      setPublicUrls(urlMap);
    };

    if (images.length > 0) {
      getPublicUrls();
    }
  }, [images]);

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
        <p>No images available in the gallery.</p>
        <p className="text-sm mt-2">Upload some images to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        publicUrls[image.id] ? (
          <GalleryItem
            key={image.id}
            imageUrl={publicUrls[image.id]}
            imageId={image.id}
            onDelete={() => onImageDelete(image.url)}
          />
        ) : null
      ))}
    </div>
  );
}