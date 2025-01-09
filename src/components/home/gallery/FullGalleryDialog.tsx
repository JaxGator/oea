import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GalleryGrid } from "./GalleryGrid";
import { useState } from "react";
import { ImagePreviewDialog } from "./ImagePreviewDialog";

interface FullGalleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FullGalleryDialog({ open, onOpenChange }: FullGalleryDialogProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: images = [] } = useQuery({
    queryKey: ['gallery-full'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      if (!data) return [];

      // Transform the data to return the full public URLs for the images
      return data.map(image => {
        const { data: urlData } = supabase.storage
          .from('gallery')
          .getPublicUrl(image.file_name);
        return urlData.publicUrl;
      });
    },
  });

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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-6">
          <h2 className="text-2xl font-bold mb-6">Photo Gallery</h2>
          <GalleryGrid 
            images={images} 
            onImageSelect={setSelectedImage}
          />
        </DialogContent>
      </Dialog>

      <ImagePreviewDialog
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
        onNavigate={handleNavigate}
        isFirstImage={isFirstImage}
        isLastImage={isLastImage}
      />
    </>
  );
}