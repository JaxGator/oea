import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryHeaderProps {
  onViewAllClick: () => void;
}

export const GalleryHeader = ({ onViewAllClick }: GalleryHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <Camera className="h-6 w-6" role="presentation" />
        Photo Gallery
      </h2>
      <Button onClick={onViewAllClick} variant="outline">
        View All Photos
      </Button>
    </div>
  );
};