import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GalleryItem } from "./GalleryItem";
import { toast } from "@/hooks/use-toast";
import { useSession } from "@/hooks/auth/useSession";

interface GalleryGridContainerProps {
  images: Array<{ url: string; id: string }>;
  onImageDelete: (imageUrl: string) => void;
}

export function GalleryGridContainer({ images, onImageDelete }: GalleryGridContainerProps) {
  const [validImages, setValidImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSession();

  useEffect(() => {
    const validateAndGetPublicUrls = async () => {
      if (!user) {
        console.error('No authenticated user found');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const urlMap: Record<string, string> = {};
      
      for (const image of images) {
        try {
          // Extract filename, handling both full URLs and direct filenames
          const fileName = image.url.includes('/')
            ? image.url.split('/').pop()?.split('?')[0]
            : image.url;

          if (fileName) {
            // Get the public URL first
            const { data: { publicUrl } } = supabase.storage
              .from('gallery')
              .getPublicUrl(fileName);

            if (publicUrl) {
              // Verify the image URL is accessible
              try {
                const response = await fetch(publicUrl, { method: 'HEAD' });
                if (response.ok) {
                  urlMap[image.id] = publicUrl;
                } else {
                  console.warn('Image URL not accessible:', fileName);
                  onImageDelete(image.url);
                }
              } catch (error) {
                console.error('Error verifying image URL:', error);
                onImageDelete(image.url);
              }
            }
          }
        } catch (error) {
          console.error('Error processing image:', error);
          onImageDelete(image.url);
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
  }, [images, onImageDelete, user]);

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Loading gallery images...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
        <p>Please sign in to view the gallery.</p>
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