import { Card, CardContent } from "@/components/ui/card";
import { useGalleryImages } from "@/hooks/useGalleryImages";
import { GalleryDebugInfo } from "./GalleryDebugInfo";
import { GalleryImageGrid } from "./GalleryImageGrid";

export const PhotoGallery = () => {
  const { images, isLoading, error, isConnected } = useGalleryImages();

  return (
    <div className="space-y-4 border-2 border-blue-500 p-4 rounded-lg">
      <h2 className="text-2xl font-bold">Photo Gallery</h2>
      
      <GalleryDebugInfo
        isLoading={isLoading}
        isConnected={isConnected}
        error={error}
        imagesCount={images.length}
      />

      {isLoading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <Card className="bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && images.length === 0 && (
        <Card>
          <CardContent className="p-4 text-center text-gray-500">
            No images available in the gallery
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && images.length > 0 && (
        <GalleryImageGrid images={images} />
      )}
    </div>
  );
};