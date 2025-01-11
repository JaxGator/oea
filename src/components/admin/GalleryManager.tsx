import { ImageUploadForm } from "./gallery/ImageUploadForm";
import { ImageGrid } from "./gallery/ImageGrid";
import { CarouselToggle } from "./gallery/CarouselToggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useGalleryImages } from "@/hooks/gallery/useGalleryImages";
import { useCarouselConfig } from "@/hooks/gallery/useCarouselConfig";
import { useSession } from "@/hooks/auth/useSession";

export default function GalleryManager() {
  const { images, isLoading, fetchImages } = useGalleryImages();
  const { carouselEnabled, updateCarouselConfig } = useCarouselConfig();
  const { user } = useSession();

  console.log('GalleryManager rendering with:', {
    imageCount: images?.length || 0,
    isLoading,
    carouselEnabled,
    userId: user?.id
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Please sign in to manage the gallery.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading gallery...</p>
        </div>
      </div>
    );
  }

  const handleImageDelete = async (imageUrl: string) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Extract the filename from the URL
      const fileName = imageUrl.includes('/') ? imageUrl.split('/').pop()?.split('?')[0] : imageUrl;

      if (!fileName) {
        throw new Error('Invalid image URL');
      }

      console.log('Attempting to delete image:', {
        fileName,
        fullUrl: imageUrl,
        userId: user.id
      });

      // First delete from database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('file_name', fileName)
        .eq('user_id', user.id);

      if (dbError) {
        console.error('Database deletion error:', dbError);
        throw dbError;
      }

      // Then delete from storage
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([fileName]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
        throw storageError;
      }

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
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Gallery Management</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload and manage images for your site's gallery. Enable carousel mode for automatic image rotation.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CarouselToggle 
          enabled={carouselEnabled}
          onToggle={updateCarouselConfig}
        />
      </div>

      <ImageUploadForm onUploadComplete={fetchImages} />
      
      <ImageGrid 
        images={images || []} 
        onImageDelete={handleImageDelete}
      />
    </div>
  );
}