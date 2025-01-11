import { GalleryGridContainer } from "./GalleryGridContainer";
import { GalleryEmptyState } from "./GalleryEmptyState";

interface ImageGridProps {
  images: Array<{ url: string; id: string }>;
  onImageDelete: () => void;
}

export function ImageGrid({ images, onImageDelete }: ImageGridProps) {
  if (!images || images.length === 0) {
    return <GalleryEmptyState />;
  }

  return (
    <GalleryGridContainer
      images={images}
      onImageDelete={onImageDelete}
    />
  );
}