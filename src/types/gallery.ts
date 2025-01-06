export interface GalleryImage {
  id: string;
  url: string;
  fileName: string;
  displayOrder: number;
}

export interface GalleryConfig {
  isCarouselEnabled: boolean;
}

export interface GalleryProps {
  images: string[];
  isLoading: boolean;
  error: Error | null;
  selectedImage: string | null;
  onImageSelect: (imageUrl: string) => void;
  onImageDeselect: () => void;
}