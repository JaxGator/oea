import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GalleryItem } from "./GalleryItem";
import { toast } from "@/hooks/use-toast";
import { useSession } from "@/hooks/auth/useSession";

interface GalleryGridContainerProps {
  images: Array<{ url: string; id: string }>;
  onImageDelete: () => void;
}

export function GalleryGridContainer({ images, onImageDelete }: GalleryGridContainerProps) {
  const [validImages, setValidImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSession();

  useEffect(() => {
    const validateAndGetPublicUrls = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const urlMap: Record<string, string> = {};
      
      for (const image of images) {
        try {
          let fileName = image.url;
          
          if (image.url.includes('supabase.co')) {
            const urlParts = image.url.split('/');
            fileName = urlParts[urlParts.length - 1].split('?')[0];
          } else if (image.url.includes('/')) {
            fileName = image.url.split('/').pop() || '';
          }

          if (!fileName) {
            console.error('Invalid file name:', image.url);
            continue;
          }

          const { data } = supabase.storage
            .from('gallery')
            .getPublicUrl(fileName);

          if (data?.publicUrl) {
            urlMap[image.id] = data.publicUrl;
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
  }, [images, user]);

  const handleImageDelete = async (url: string) => {
    try {
      if (!user) return;

      const fileName = url.includes('/') ? url.split('/').pop()?.split('?')[0] : url;
      if (!fileName) return;

      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('file_name', fileName)
        .eq('user_id', user.id);

      if (dbError) throw dbError;

      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([fileName]);

      if (storageError) throw storageError;

      onImageDelete();
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <GalleryLoadingState />;
  }

  if (!user) {
    return (
      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
        <p>Please sign in to view the gallery.</p>
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
            onDelete={() => handleImageDelete(image.url)}
          />
        ) : null
      ))}
    </div>
  );
}