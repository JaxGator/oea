interface GalleryGridProps {
  images: Array<{ file_name: string }>;
  onImageClick: (imageUrl: string) => void;
}

export function GalleryGrid({ images, onImageClick }: GalleryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div 
          key={index}
          className="relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onImageClick(image.file_name)}
        >
          <img
            src={image.file_name}
            alt={`Gallery image ${index + 1}`}
            className="object-cover w-full h-full"
          />
        </div>
      ))}
    </div>
  );
}