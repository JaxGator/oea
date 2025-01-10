interface GalleryGridProps {
  images: string[];
  onImageSelect: (imageUrl: string) => void;
  onKeyPress?: (imageUrl: string) => (e: React.KeyboardEvent) => void;
  isLoading?: boolean;
  isAdmin?: boolean;
  isPreview?: boolean;
}

export function GalleryGrid({ 
  images, 
  onImageSelect,
  onKeyPress = () => () => {},
  isLoading = false,
  isAdmin = false,
  isPreview = false
}: GalleryGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((index) => (
          <div 
            key={index}
            className="aspect-square bg-gray-200 rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No images available in the gallery.
      </div>
    );
  }

  const displayImages = isPreview ? images.slice(0, 4) : images;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {displayImages.map((imageUrl, index) => (
        <div 
          key={`${imageUrl}-${index}`}
          className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
          onClick={() => onImageSelect(imageUrl)}
          onKeyPress={onKeyPress(imageUrl)}
          tabIndex={0}
          role="button"
        >
          <img
            src={imageUrl}
            alt={`Gallery image ${index + 1}`}
            className="object-cover w-full h-full transition-all duration-300 group-hover:scale-105 animate-fade-in"
            onError={(e) => {
              console.error('Failed to load image:', imageUrl);
              const img = e.target as HTMLImageElement;
              img.src = '/placeholder.svg';
            }}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}