import { useGalleryManager } from "./gallery/hooks/useGalleryManager";
import { ImageUploadForm } from "./gallery/ImageUploadForm";
import { ImageGrid } from "./gallery/ImageGrid";
import { CarouselToggle } from "./gallery/CarouselToggle";

export function GalleryManager() {
  const {
    images,
    isLoading,
    carouselEnabled,
    fetchImages,
    updateCarouselConfig
  } = useGalleryManager();

  if (isLoading) {
    return <div>Loading gallery...</div>;
  }

  return (
    <div className="space-y-6">
      <CarouselToggle 
        enabled={carouselEnabled}
        onToggle={updateCarouselConfig}
      />
      <ImageUploadForm onUploadSuccess={fetchImages} />
      <ImageGrid 
        images={images} 
        onImageDelete={async (imageUrl: string) => {
          try {
            const fileName = imageUrl.split('/').pop()?.split('?')[0];
            if (!fileName) {
              throw new Error('Invalid image URL');
            }

            console.log('Deleting image:', fileName);
            const { error: storageError } = await supabase.storage
              .from('gallery')
              .remove([fileName]);

            if (storageError) throw storageError;

            console.log('Image deleted successfully');
            toast({
              title: "Success",
              description: "Image deleted successfully",
            });
            
            fetchImages();
          } catch (error) {
            console.error('Error deleting image:', error);
            toast({
              title: "Error",
              description: "Failed to delete image. Please try again.",
              variant: "destructive",
            });
          }
        }}
      />
    </div>
  );
}