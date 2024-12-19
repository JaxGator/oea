import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploadForm } from "./gallery/ImageUploadForm";
import { ImageGrid } from "./gallery/ImageGrid";

export function GalleryManager() {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data: bucketData } = await supabase.storage
        .from('gallery')
        .getPublicUrl('');

      const { data, error } = await supabase.storage
        .from('gallery')
        .list();

      if (error) throw error;

      const imageUrls = data
        .filter(file => file.name.match(/\.(jpg|jpeg|png|gif)$/i))
        .map(file => `${bucketData.publicUrl}/${file.name}`);

      setImages(imageUrls);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageDelete = (deletedImageUrl: string) => {
    setImages(images.filter(img => img !== deletedImageUrl));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <ImageUploadForm onUploadSuccess={fetchImages} />
      <ImageGrid images={images} onImageDelete={handleImageDelete} />
    </div>
  );
}