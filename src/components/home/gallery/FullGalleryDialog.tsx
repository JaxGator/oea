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
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data) return [];

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
        <DialogContent className="max-w-[95vw] max-h-[90vh] p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Photo Gallery
          </h2>
          <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
            <GalleryGrid 
              images={images} 
              onImageSelect={setSelectedImage}
            />
          </div>
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