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
          // Extract filename from URL or path, handling multiple formats
          let fileName = image.url;
          
          // Handle full URLs
          if (image.url.includes('supabase.co')) {
            fileName = image.url.split('/').pop()?.split('?')[0] || '';
          }
          // Handle relative paths
          else if (image.url.includes('/')) {
            fileName = image.url.split('/').pop() || '';
          }

          if (!fileName) {
            console.error('Invalid file name:', image.url);
            continue;
          }

          console.log('Processing image:', {
            originalUrl: image.url,
            extractedFileName: fileName,
            imageId: image.id
          });

          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('gallery')
            .getPublicUrl(fileName);

          if (!publicUrl) {
            console.error('Failed to generate public URL for:', fileName);
            continue;
          }

          // Verify the image exists and is accessible
          try {
            const response = await fetch(publicUrl, { method: 'HEAD' });
            if (response.ok) {
              // Additional check for image MIME type
              const contentType = response.headers.get('content-type');
              if (contentType && contentType.startsWith('image/')) {
                urlMap[image.id] = publicUrl;
                console.log('Successfully validated image:', {
                  fileName,
                  publicUrl,
                  imageId: image.id,
                  contentType
                });
              } else {
                console.warn('Invalid content type for image:', {
                  fileName,
                  contentType,
                  imageId: image.id
                });
                onImageDelete(image.url);
              }
            } else {
              console.warn('Image not accessible:', {
                fileName,
                status: response.status,
                imageId: image.id
              });
              onImageDelete(image.url);
            }
          } catch (error) {
            console.error('Error verifying image:', {
              fileName,
              error,
              imageId: image.id
            });
            onImageDelete(image.url);
          }
        } catch (error) {
          console.error('Error processing image:', {
            imageUrl: image.url,
            error,
            imageId: image.id
          });
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