import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface GalleryGridContainerProps {
  images: Array<{ url: string; id: string }>;
  onImageDelete: (imageUrl: string) => void;
}

export function GalleryGridContainer({ images, onImageDelete }: GalleryGridContainerProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<string>>(new Set());
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSignedUrls = async () => {
      try {
        const urlPromises = images.map(async (image) => {
          try {
            // Extract the file name from the URL
            const fileName = image.url.split('/').pop();
            if (!fileName) {
              console.error('Invalid file name:', image.url);
              return null;
            }

            // Get a signed URL with a longer expiry
            const { data: { signedUrl }, error } = await supabase
              .storage
              .from('gallery')
              .createSignedUrl(fileName, 3600); // 1 hour expiry

            if (error) {
              console.error('Error getting signed URL:', {
                error,
                fileName,
                imageId: image.id
              });
              
              toast({
                title: "Error",
                description: "Failed to load some images. Please try refreshing.",
                variant: "destructive",
              });
              
              return null;
            }

            return { id: image.id, signedUrl };
          } catch (error) {
            console.error('Error processing URL:', {
              error,
              imageUrl: image.url,
              imageId: image.id
            });
            return null;
          }
        });

        const results = await Promise.all(urlPromises);
        const urlMap: Record<string, string> = {};
        results.forEach(result => {
          if (result) {
            urlMap[result.id] = result.signedUrl;
          }
        });
        
        setSignedUrls(urlMap);
      } catch (error) {
        console.error('Error fetching signed URLs:', error);
        toast({
          title: "Error",
          description: "Failed to load gallery images",
          variant: "destructive",
        });
      }
    };

    if (images.length > 0) {
      fetchSignedUrls();
    }
  }, [images]);

  const handleImageLoad = (imageId: string) => {
    setLoadedImages(prev => new Set([...prev, imageId]));
    setErrorImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(imageId);
      return newSet;
    });
  };

  const handleImageError = (imageId: string, imageUrl: string) => {
    console.error('Failed to load image:', {
      id: imageId,
      url: imageUrl,
      signedUrl: signedUrls[imageId],
      timestamp: new Date().toISOString()
    });
    
    setErrorImages(prev => new Set([...prev, imageId]));
  };

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
        <div key={image.id} className="relative group aspect-square">
          {/* Loading placeholder */}
          <div className={`w-full h-full bg-muted rounded-lg flex items-center justify-center ${
            loadedImages.has(image.id) ? 'hidden' : 'block'
          }`}>
            {errorImages.has(image.id) ? (
              <span className="text-destructive text-sm">Failed to load image</span>
            ) : (
              <span className="text-muted-foreground">Loading...</span>
            )}
          </div>
          
          {/* Actual image */}
          {signedUrls[image.id] && (
            <img
              src={signedUrls[image.id]}
              alt="Gallery image"
              className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
                loadedImages.has(image.id) ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => handleImageLoad(image.id)}
              onError={() => handleImageError(image.id, image.url)}
            />
          )}
          
          {/* Delete button */}
          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              console.log('Deleting image:', {
                id: image.id,
                url: image.url
              });
              onImageDelete(image.url);
            }}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}