interface GalleryGridProps {
  images: string[];
  onImageSelect: (imageUrl: string) => void;
  onKeyPress?: (imageUrl: string) => (e: React.KeyboardEvent) => void;
  isLoading?: boolean;
  isAdmin?: boolean;
}

export function GalleryGrid({ 
  images, 
  onImageSelect,
  onKeyPress = () => () => {},
  isLoading = false,
  isAdmin = false 
}: GalleryGridProps) {
  if (isLoading) {
    return <div className="text-center py-8">Loading gallery...</div>;
  }

  if (!images || images.length === 0) {
    return <div className="text-center py-8 text-gray-500">No images available in the gallery.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((imageUrl, index) => (
        <div 
          key={`${imageUrl}-${index}`}
          className="relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onImageSelect(imageUrl)}
          onKeyPress={onKeyPress(imageUrl)}
          tabIndex={0}
          role="button"
        >
          <img
            src={imageUrl}
            alt={`Gallery image ${index + 1}`}
            className="object-cover w-full h-full"
            onError={(e) => {
              console.error('Failed to load image:', imageUrl);
              const img = e.target as HTMLImageElement;
              img.src = '/placeholder.svg';
            }}
          />
        </div>
      ))}
    </div>
  );
}