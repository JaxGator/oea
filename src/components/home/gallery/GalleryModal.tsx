import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface GalleryModalProps {
  selectedImage: string | null;
  onClose: () => void;
}

export const GalleryModal = ({ selectedImage, onClose }: GalleryModalProps) => {
  const [isLoading, setIsLoading] = useState(true);

  if (!selectedImage) return null;

  return (
    <Dialog open={!!selectedImage} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-2 bg-[#F1F1F1] relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-50 bg-white/80 hover:bg-white"
          onClick={onClose}
          aria-label="Close image preview"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="relative w-full h-full flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          <img
            src={selectedImage}
            alt="Selected gallery image"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            style={{ margin: 'auto' }}
            onLoad={() => setIsLoading(false)}
            loading="eager"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};