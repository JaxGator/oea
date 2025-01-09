import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ImagePreviewDialog } from "./ImagePreviewDialog";
import { FullGalleryDialog } from "./FullGalleryDialog";
import { GalleryGrid } from "./GalleryGrid";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function GalleryPreview() {
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: images = [] } = useQuery({
    queryKey: ['gallery-preview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true })
        .limit(6);

      if (error) throw error;

      // Transform the data to return the full public URLs for the images
      return data.map(image => {
        const { data: urlData } = supabase.storage
          .from('gallery')
          .getPublicUrl(image.file_name);
        return urlData.publicUrl;
      });
    },
  });

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleNavigate = (direction: 'next' | 'prev') => {
    const currentIndex = images.findIndex(img => img === selectedImage);
    if (currentIndex === -1) return;

    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % images.length 
      : (currentIndex - 1 + images.length) % images.length;

    setSelectedImage(images[newIndex]);
  };

  const isFirstImage = selectedImage === images[0];
  const isLastImage = selectedImage === images[images.length - 1];

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Photo Gallery</h2>
          <Button 
            onClick={() => setShowFullGallery(true)}
            className="bg-[#0d97d1] hover:bg-[#0d97d1]/90 text-white"
          >
            View All
          </Button>
        </div>

        <GalleryGrid 
          images={images} 
          onImageSelect={handleImageSelect}
        />

        <FullGalleryDialog
          open={showFullGallery}
          onOpenChange={setShowFullGallery}
        />

        <ImagePreviewDialog
          selectedImage={selectedImage}
          onClose={() => setSelectedImage(null)}
          onNavigate={handleNavigate}
          isFirstImage={isFirstImage}
          isLastImage={isLastImage}
        />
      </div>
    </div>
  );
}