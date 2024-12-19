import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploadForm } from "./gallery/ImageUploadForm";
import { ImageGrid } from "./gallery/ImageGrid";
import { useToast } from "@/hooks/use-toast";

export function GalleryManager() {
  const [images, setImages] = useState<Array<{ url: string; id: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data: storageData, error: storageError } = await supabase.storage
        .from('gallery')
        .list();

      if (storageError) throw storageError;

      const imageUrls = storageData
        .filter(file => file.name.match(/\.(jpg|jpeg|png|gif)$/i))
        .map(file => ({
          id: file.id,
          url: `${supabase.storage.from('gallery').getPublicUrl(file.name).data.publicUrl}`
        }));

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

  const handleImageDelete = async (imageUrl: string) => {
    try {
      const fileName = imageUrl.split('/').pop();
      if (!fileName) return;

      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([fileName]);

      if (storageError) throw storageError;

      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
      
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
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
      />
    </div>
  );
}