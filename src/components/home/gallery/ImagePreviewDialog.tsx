import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GalleryModalContent } from "./GalleryModalContent";

interface ImagePreviewDialogProps {
  selectedImage: string | null;
  onClose: () => void;
  onNavigate: (direction: 'next' | 'prev') => void;
  isFirstImage: boolean;
  isLastImage: boolean;
}

export function ImagePreviewDialog({
  selectedImage,
  onClose,
  onNavigate,
  isFirstImage,
  isLastImage,
}: ImagePreviewDialogProps) {
  if (!selectedImage) return null;

  return (
    <Dialog 
      open={!!selectedImage} 
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-2 bg-transparent border-none">
        <GalleryModalContent
          selectedImage={selectedImage}
          onClose={onClose}
          onNavigate={onNavigate}
          isFirstImage={isFirstImage}
          isLastImage={isLastImage}
        />
      </DialogContent>
    </Dialog>
  );
}