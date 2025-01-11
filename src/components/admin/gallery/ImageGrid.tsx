import { GalleryGridContainer } from "./GalleryGridContainer";

interface ImageGridProps {
  images: Array<{ url: string; id: string }>;
  onImageDelete: () => void;
}

export function ImageGrid({ images, onImageDelete }: ImageGridProps) {
  return (
    <GalleryGridContainer
      images={images}
      onImageDelete={onImageDelete}
    />
  );
}