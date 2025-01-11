import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GalleryItem } from "./GalleryItem";
import { toast } from "@/hooks/use-toast";
import { useSession } from "@/hooks/auth/useSession";
import { GalleryLoadingState } from "./GalleryLoadingState";
import { useGalleryImageUrls } from "@/hooks/gallery/useGalleryImageUrls";

interface GalleryGridContainerProps {
  images: Array<{ url: string; id: string }>;
  onImageDelete: () => void;
}

export function GalleryGridContainer({ images, onImageDelete }: GalleryGridContainerProps) {
  const { user } = useSession();
  const { validUrls, isLoading } = useGalleryImageUrls(images);
  const [deletingImages, setDeletingImages] = useState<Set<string>>(new Set());

  const handleImageDelete = async (url: string, imageId: string) => {
    try {
      if (!user) return;
      setDeletingImages(prev => new Set(prev).add(imageId));

      // Extract filename from URL
      let fileName = url;
      if (url.includes('supabase.co')) {
        const urlParts = url.split('/');
        fileName = urlParts[urlParts.length - 1].split('?')[0];
      }

      // Delete from database first
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('file_name', fileName);

      if (dbError) throw dbError;

      // Then delete from storage
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([fileName]);

      if (storageError) {
        console.warn('Storage deletion error:', storageError);
        // Continue anyway as the database record is already deleted
      }

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
    } finally {
      setDeletingImages(prev => {
        const next = new Set(prev);
        next.delete(imageId);
        return next;
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
        validUrls[image.id] ? (
          <GalleryItem
            key={image.id}
            imageUrl={validUrls[image.id]}
            imageId={image.id}
            onDelete={() => handleImageDelete(image.url, image.id)}
            isDeleting={deletingImages.has(image.id)}
          />
        ) : null
      ))}
    </div>
  );
}