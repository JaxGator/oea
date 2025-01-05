interface GalleryGridProps {
  images: string[];
  onImageSelect: (imageUrl: string) => void;
  onKeyPress: (imageUrl: string) => (e: React.KeyboardEvent) => void;
}

export const GalleryGrid = ({ images, onImageSelect, onKeyPress }: GalleryGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {images.slice(0, 4).map((imageUrl, index) => (
        <button
          key={index}
          className="aspect-square overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => onImageSelect(imageUrl)}
          onKeyDown={onKeyPress(imageUrl)}
          aria-label={`View gallery image ${index + 1}`}
        >
          <img
            src={imageUrl}
            alt={`Gallery preview ${index + 1}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </button>
      ))}
    </div>
  );
};