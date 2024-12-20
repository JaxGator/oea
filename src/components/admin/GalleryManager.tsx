import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploadForm } from "./gallery/ImageUploadForm";
import { ImageGrid } from "./gallery/ImageGrid";
import { AlbumCreateForm } from "./gallery/AlbumCreateForm";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
          id: file.name,
          url: supabase.storage.from('gallery').getPublicUrl(file.name).data.publicUrl
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
      const fileName = imageUrl.split('/').pop()?.split('?')[0];
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
    <Tabs defaultValue="images" className="space-y-6">
      <TabsList>
        <TabsTrigger value="images">Images</TabsTrigger>
        <TabsTrigger value="albums">Albums</TabsTrigger>
      </TabsList>
      
      <TabsContent value="images" className="space-y-6">
        <ImageUploadForm onUploadSuccess={fetchImages} />
        <ImageGrid 
          images={images} 
          onImageDelete={handleImageDelete}
        />
      </TabsContent>
      
      <TabsContent value="albums">
        <div className="space-y-6">
          <AlbumCreateForm onSuccess={fetchImages} />
        </div>
      </TabsContent>
    </Tabs>
  );
}