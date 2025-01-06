import { Dialog, DialogContent } from "@/components/ui/dialog";

interface GalleryModalProps {
  selectedImage: string;
  onClose: () => void;
}

export const GalleryModal = ({ selectedImage, onClose }: GalleryModalProps) => {
  if (!selectedImage) return null;

  return (
    <Dialog open={!!selectedImage} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-2">
        <div className="relative w-full h-full flex items-center justify-center bg-background">
          <img
            src={selectedImage}
            alt="Selected gallery image"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};