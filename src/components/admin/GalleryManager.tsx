import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploadForm } from "./gallery/ImageUploadForm";
import { ImageGrid } from "./gallery/ImageGrid";
import { useToast } from "@/hooks/use-toast";

export function GalleryManager() {
  const [images, setImages] = useState<Array<{ url: string; id: string; displayOrder: number; fileName: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data: galleryData, error: galleryError } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order');

      if (galleryError) throw galleryError;

      const imageUrls = await Promise.all(
        galleryData.map(async (item) => {
          const { data: { publicUrl } } = supabase.storage
            .from('gallery')
            .getPublicUrl(item.file_name);

          return {
            url: publicUrl,
            id: item.id,
            displayOrder: item.display_order,
            fileName: item.file_name
          };
        })
      );

      setImages(imageUrls);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: "Error",
        description: "Failed to fetch images",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageDelete = (deletedImageUrl: string) => {
    setImages(images.filter(img => img.url !== deletedImageUrl));
  };

  const handleReorder = async (reorderedImages: typeof images) => {
    try {
      setImages(reorderedImages);

      const updates = reorderedImages.map((image, index) => ({
        id: image.id,
        display_order: index,
        file_name: image.fileName
      }));

      const { error } = await supabase
        .from('gallery_images')
        .upsert(updates);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Gallery order updated successfully",
      });
    } catch (error) {
      console.error('Error updating image order:', error);
      toast({
        title: "Error",
        description: "Failed to update gallery order",
        variant: "destructive",
      });
      fetchImages();
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <ImageUploadForm onUploadSuccess={fetchImages} />
      <ImageGrid 
        images={images} 
        onImageDelete={handleImageDelete}
        onReorder={handleReorder}
      />
    </div>
  );
}