import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryPreviewModalProps {
  selectedImage: string | null;
  onClose: () => void;
  onNavigate: (direction: 'next' | 'prev') => void;
  isFirstImage: boolean;
  isLastImage: boolean;
}

export function GalleryPreviewModal({
  selectedImage,
  onClose,
  onNavigate,
  isFirstImage,
  isLastImage,
}: GalleryPreviewModalProps) {
  if (!selectedImage) return null;

  return (
    <Dialog open={!!selectedImage} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-2 bg-transparent border-none">
        <div className="relative w-full h-full flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full z-[60]"
            onClick={() => onNavigate('prev')}
            disabled={isFirstImage}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          
          <img
            src={selectedImage}
            alt="Gallery preview"
            className="max-w-full max-h-[85vh] object-contain relative z-[55]"
          />
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full z-[60]"
            onClick={() => onNavigate('next')}
            disabled={isLastImage}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}