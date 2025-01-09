import { X } from "lucide-react";
import { useState } from "react";

interface GalleryGridContainerProps {
  images: Array<{ url: string; id: string }>;
  onImageDelete: (imageUrl: string) => void;
}

export function GalleryGridContainer({ images, onImageDelete }: GalleryGridContainerProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (imageId: string) => {
    console.log('Image loaded successfully:', imageId);
    setLoadedImages(prev => new Set([...prev, imageId]));
  };

  const handleImageError = (imageUrl: string) => {
    console.error(`Failed to load image: ${imageUrl}`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image.id} className="relative group aspect-square">
          <div className={`w-full h-full bg-gray-100 rounded-lg ${
            loadedImages.has(image.id) ? 'hidden' : 'block'
          }`} />
          <img
            src={image.url}
            alt={`Gallery image`}
            className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
              loadedImages.has(image.id) ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => handleImageLoad(image.id)}
            onError={() => handleImageError(image.url)}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onImageDelete(image.url);
            }}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}