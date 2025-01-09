import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ImagePreviewDialog } from "./gallery/ImagePreviewDialog";
import { FullGalleryDialog } from "./gallery/FullGalleryDialog";
import { GalleryGrid } from "./gallery/GalleryGrid";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export function GalleryPreview() {
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: images = [], isError, isLoading } = useQuery({
    queryKey: ['gallery-preview'],
    queryFn: async () => {
      try {
        console.log('Fetching gallery preview images...');
        
        const { data: galleryData, error: dbError } = await supabase
          .from('gallery_images')
          .select('*')
          .order('display_order', { ascending: true })
          .limit(6);

        if (dbError) {
          console.error('Error fetching gallery data:', dbError);
          throw dbError;
        }

        console.log('Gallery preview data fetched:', galleryData);

        if (!galleryData || galleryData.length === 0) {
          console.log('No gallery images found');
          return [];
        }

        // Transform the data to return the full public URLs for the images
        const imageUrls = galleryData.map(image => {
          const { data: urlData } = supabase.storage
            .from('gallery')
            .getPublicUrl(image.file_name);
          
          console.log('Generated URL for preview image:', {
            fileName: image.file_name,
            url: urlData.publicUrl,
            timestamp: new Date().toISOString()
          });
          
          // Validate URL accessibility
          fetch(urlData.publicUrl, { method: 'HEAD' })
            .then(response => {
              if (!response.ok) {
                console.error(`Image URL not accessible: ${urlData.publicUrl}`, response.status);
              } else {
                console.log(`Image URL accessible: ${urlData.publicUrl}`);
              }
            })
            .catch(error => {
              console.error(`Failed to validate image URL: ${urlData.publicUrl}`, error);
            });

          return urlData.publicUrl;
        });

        console.log('Final preview image URLs:', imageUrls);
        return imageUrls;
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
    console.log('Selected image:', imageUrl);
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
          isLoading={isLoading}
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