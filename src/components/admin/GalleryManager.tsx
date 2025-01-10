import { ImageUploadForm } from "./gallery/ImageUploadForm";
import { ImageGrid } from "./gallery/ImageGrid";
import { CarouselToggle } from "./gallery/CarouselToggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useGalleryImages } from "@/hooks/gallery/useGalleryImages";
import { useCarouselConfig } from "@/hooks/gallery/useCarouselConfig";

export default function GalleryManager() {
  const { images, isLoading, fetchImages } = useGalleryImages();
  const { carouselEnabled, updateCarouselConfig } = useCarouselConfig();

  if (isLoading) {
    return <div>Loading gallery...</div>;
  }

  return (
    <div className="space-y-6">
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

            const { error: dbError } = await supabase
              .from('gallery_images')
              .delete()
              .eq('file_name', fileName);

            if (dbError) throw dbError;

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