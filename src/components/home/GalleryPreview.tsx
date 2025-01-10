import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ImagePreviewDialog } from "./gallery/ImagePreviewDialog";
import { FullGalleryDialog } from "./gallery/FullGalleryDialog";
import { GalleryGrid } from "./gallery/GalleryGrid";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function GalleryPreview() {
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: images = [], isError } = useQuery({
    queryKey: ['gallery-preview'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('gallery_images')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4); // Updated to fetch 4 images for preview

        if (error) {
          console.error('Error fetching gallery images:', error);
          toast.error('Failed to load gallery images');
          throw error;
        }

        if (!data) return [];

        return data.map(image => {
          const { data: urlData } = supabase.storage
            .from('gallery')
            .getPublicUrl(image.file_name);
          return urlData.publicUrl;
        });
      } catch (error) {
        console.error('Gallery fetch error:', error);
        toast.error('Failed to load gallery images');
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
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

  if (isError) {
    return (
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">
            Failed to load gallery images. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Camera className="h-6 w-6 text-gray-900" />
            <h2 className="text-2xl font-bold text-gray-900">Photo Gallery</h2>
          </div>
          <Button 
            onClick={() => setShowFullGallery(true)}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            View All
          </Button>
        </div>

        <GalleryGrid 
          images={images} 
          onImageSelect={handleImageSelect}
          isPreview={true}
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