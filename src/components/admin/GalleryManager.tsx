import { ImageUploadForm } from "./gallery/ImageUploadForm";
import { ImageGrid } from "./gallery/ImageGrid";
import { CarouselToggle } from "./gallery/CarouselToggle";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useGalleryImages } from "@/hooks/gallery/useGalleryImages";
import { useCarouselConfig } from "@/hooks/gallery/useCarouselConfig";
import { useSession } from "@/hooks/auth/useSession";
import { GalleryLoadingState } from "./gallery/GalleryLoadingState";

export default function GalleryManager() {
  const { images, isLoading, fetchImages } = useGalleryImages();
  const { carouselEnabled, updateCarouselConfig } = useCarouselConfig();
  const { user, profile } = useSession();

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Please sign in to view the gallery manager.</p>
        </div>
      </div>
    );
  }

  if (!profile?.is_admin) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Only administrators can manage the gallery.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <GalleryLoadingState />;
  }

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
        onImageDelete={fetchImages}
      />
    </div>
  );
}