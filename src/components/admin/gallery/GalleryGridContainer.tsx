
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GalleryItem } from "./GalleryItem";
import { toast } from "sonner";
import { useSession } from "@/hooks/auth/useSession";

interface GalleryGridContainerProps {
  images: Array<{ url: string; id: string }>;
  onImageDelete: () => void;
}

export function GalleryGridContainer({ images, onImageDelete }: GalleryGridContainerProps) {
  const { user } = useSession();
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

      // Delete from database using RPC to avoid type issues
      try {
        await supabase.rpc('delete_gallery_image', {
          p_file_name: fileName
        });
      } catch (dbError) {
        console.error('Database deletion error:', dbError);
        // Try direct delete as fallback
        await fetch('/api/gallery/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName })
        });
      }

      // Then delete from storage (this might still have type issues but is less critical)
      try {
        await supabase.storage
          .from('gallery')
          .remove([fileName]);
      } catch (storageError) {
        console.warn('Storage deletion error:', storageError);
      }

      onImageDelete();
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error("Failed to delete image. Please try again.");
    } finally {
      setDeletingImages(prev => {
        const next = new Set(prev);
        next.delete(imageId);
        return next;
      });
    }
  };

  if (!user) {
    return (
      <div className="text-center py-6 sm:py-8 text-muted-foreground border-2 border-dashed rounded-lg">
        <p>Please sign in to view the gallery.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image.id} className="group">
          <GalleryItem
            imageUrl={image.url}
            imageId={image.id}
            onDelete={() => handleImageDelete(image.url, image.id)}
            isDeleting={deletingImages.has(image.id)}
          />
        </div>
      ))}
    </div>
  );
}
