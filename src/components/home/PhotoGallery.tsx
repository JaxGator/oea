
import { Card, CardContent } from "@/components/ui/card";
import { useGalleryPreview } from "@/hooks/gallery/useGalleryPreview";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

export const PhotoGallery = () => {
  const { data: images = [], isLoading, error, refetch } = useGalleryPreview();

  const handleRefresh = async () => {
    await refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Failed to load gallery images. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Photo Gallery</h2>
        <Button 
          onClick={handleRefresh} 
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((imageUrl, index) => (
              <div 
                key={index} 
                className="aspect-square overflow-hidden rounded-lg"
              >
                <img
                  src={imageUrl}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {images.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No images available in the gallery.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
