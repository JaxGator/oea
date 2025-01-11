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
      const invalidImages: string[] = [];
      
      for (const image of images) {
        try {
          // Extract filename from URL or path, handling multiple formats
          let fileName = image.url;
          
          // Handle full URLs
          if (image.url.includes('supabase.co')) {
            const urlParts = image.url.split('/');
            fileName = urlParts[urlParts.length - 1].split('?')[0];
          }
          // Handle relative paths
          else if (image.url.includes('/')) {
            fileName = image.url.split('/').pop() || '';
          }

          if (!fileName) {
            console.error('Invalid file name:', image.url);
            invalidImages.push(image.url);
            continue;
          }

          console.log('Processing image:', {
            originalUrl: image.url,
            extractedFileName: fileName,
            imageId: image.id
          });

          // Get the public URL
          const { data } = supabase.storage
            .from('gallery')
            .getPublicUrl(fileName);

          if (!data.publicUrl) {
            console.error('Failed to generate public URL for:', fileName);
            invalidImages.push(image.url);
            continue;
          }

          // Add to valid images without HEAD request
          urlMap[image.id] = data.publicUrl;
          console.log('Successfully processed image:', {
            fileName,
            publicUrl: data.publicUrl,
            imageId: image.id
          });

        } catch (error) {
          console.error('Error processing image:', {
            imageUrl: image.url,
            error,
            imageId: image.id
          });
          invalidImages.push(image.url);
        }
      }
      
      // Clean up invalid images
      if (invalidImages.length > 0) {
        console.log('Cleaning up invalid images:', invalidImages);
        invalidImages.forEach(url => {
          onImageDelete(url);
        });
        
        if (invalidImages.length === images.length) {
          toast({
            title: "Gallery Update",
            description: "All images were invalid and have been cleaned up.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Gallery Update",
            description: `${invalidImages.length} invalid images have been cleaned up.`,
          });
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