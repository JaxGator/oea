import { useState, useEffect } from "react";
import { getSignedUrl } from "@/utils/supabaseStorage";
import { GalleryItem } from "./GalleryItem";
import { toast } from "@/hooks/use-toast";

interface GalleryGridContainerProps {
  images: Array<{ url: string; id: string }>;
  onImageDelete: (imageUrl: string) => void;
}

export function GalleryGridContainer({ images, onImageDelete }: GalleryGridContainerProps) {
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSignedUrls = async () => {
      try {
        const urlPromises = images.map(async (image) => {
          const fileName = image.url.split('/').pop()?.split('?')[0];
          if (!fileName) {
            console.error('Invalid file name:', image.url);
            return null;
          }

          const signedUrl = await getSignedUrl(fileName);
          return signedUrl ? { id: image.id, signedUrl } : null;
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
        signedUrls[image.id] ? (
          <GalleryItem
            key={image.id}
            imageUrl={signedUrls[image.id]}
            imageId={image.id}
            onDelete={() => onImageDelete(image.url)}
          />
        ) : null
      ))}
    </div>
  );
}