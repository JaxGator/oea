import { arrayMove } from '@dnd-kit/sortable';
import { GalleryGridContainer } from "./GalleryGridContainer";
import { handleImageDelete } from "./utils/imageUtils";
import { ImageType } from "./types/gallery";

interface ImageGridProps {
  images: ImageType[];
  onImageDelete: (imageUrl: string) => void;
  onReorder: (newOrder: ImageType[]) => void;
}

export function ImageGrid({ images, onImageDelete, onReorder }: ImageGridProps) {
  return (
    <GalleryGridContainer
      images={images}
      onImageDelete={(imageUrl) => handleImageDelete(imageUrl, onImageDelete)}
      onReorder={onReorder}
    />
  );
}