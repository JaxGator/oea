import { Dialog, DialogContent } from "@/components/ui/dialog";

interface GalleryModalProps {
  selectedImage: string | null;
  onClose: () => void;
}

export const GalleryModal = ({ selectedImage, onClose }: GalleryModalProps) => {
  if (!selectedImage) return null;

  return (
    <Dialog open={!!selectedImage} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[95vw] max-h-[95vh] p-2 bg-[#F1F1F1]"
        role="dialog"
        aria-modal="true"
        aria-label="Image Preview"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={selectedImage}
            alt="Selected gallery image"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            style={{ margin: 'auto' }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};