import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GalleryItem } from "./GalleryItem";
import { toast } from "@/hooks/use-toast";

interface GalleryGridContainerProps {
  images: Array<{ url: string; id: string }>;
  onImageDelete: (imageUrl: string) => void;
}

export function GalleryGridContainer({ images, onImageDelete }: GalleryGridContainerProps) {
  const [validImages, setValidImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateAndGetPublicUrls = async () => {
      setIsLoading(true);
      const urlMap: Record<string, string> = {};
      
      for (const image of images) {
        try {
          // Extract filename, handling both full URLs and direct filenames
          const fileName = image.url.includes('/')
            ? image.url.split('/').pop()?.split('?')[0]
            : image.url;

          if (fileName) {
            // Check if the file exists in the gallery bucket
            const { data: existsData, error: existsError } = await supabase.storage
              .from('gallery')
              .list('', {
                search: fileName
              });

            if (existsError) {
              console.error('Error checking file existence:', existsError);
              continue;
            }

            // Only proceed if the file exists
            if (existsData && existsData.some(file => file.name === fileName)) {
              const { data: { publicUrl } } = supabase.storage
                .from('gallery')
                .getPublicUrl(fileName);
                
              if (publicUrl) {
                urlMap[image.id] = publicUrl;
              }
            } else {
              console.warn('File not found in storage:', fileName);
              // Optionally notify about invalid image
              toast({
                title: "Invalid Image",
                description: `Image ${fileName} not found in gallery`,
                variant: "destructive",
              });
            }
          }
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }
      
      setValidImages(urlMap);
      setIsLoading(false);
    };

    if (images.length > 0) {
      validateAndGetPublicUrls();
    } else {
      setIsLoading(false);
    }
  }, [images]);

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Loading gallery images...</p>
      </div>
    );
  }

  if (Object.keys(validImages).length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
        <p>No valid images available in the gallery.</p>
        <p className="text-sm mt-2">Upload some images to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        validImages[image.id] ? (
          <GalleryItem
            key={image.id}
            imageUrl={validImages[image.id]}
            imageId={image.id}
            onDelete={() => onImageDelete(image.url)}
          />
        ) : null
      ))}
    </div>
  );
}