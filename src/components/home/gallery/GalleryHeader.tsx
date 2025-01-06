import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GalleryHeaderProps {
  onViewAllClick: () => void;
  totalImages: number;
}

export const GalleryHeader = ({ onViewAllClick, totalImages }: GalleryHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className={cn(
          "text-2xl font-bold text-gray-900 flex items-center gap-2",
          "animate-fade-in"
        )}>
          <Camera className="h-6 w-6" aria-hidden="true" />
          Photo Gallery
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {totalImages} {totalImages === 1 ? 'photo' : 'photos'} available
        </p>
      </div>
      <Button 
        onClick={onViewAllClick} 
        variant="outline"
        className={cn(
          "hover:bg-gray-100 transition-colors",
          "focus-visible:ring-2 focus-visible:ring-primary"
        )}
        aria-label={`View all ${totalImages} photos in the gallery`}
      >
        View All Photos
      </Button>
    </div>
  );
};