import { useState } from 'react';

export const useGalleryState = (images: string[]) => {
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const currentImageIndex = selectedImage ? images.indexOf(selectedImage) : -1;
  const isFirstImage = currentImageIndex <= 0;
  const isLastImage = currentImageIndex >= images.length - 1;

  const handlePrevious = () => {
    if (currentImageIndex > 0) {
      setSelectedImage(images[currentImageIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentImageIndex < images.length - 1) {
      setSelectedImage(images[currentImageIndex + 1]);
    }
  };

  const handleKeyPress = (imageUrl: string) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setSelectedImage(imageUrl);
    }
  };

  return {
    showFullGallery,
    setShowFullGallery,
    selectedImage,
    setSelectedImage,
    currentImageIndex,
    isFirstImage,
    isLastImage,
    handlePrevious,
    handleNext,
    handleKeyPress,
  };
};