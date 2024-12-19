import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface ImageGridProps {
  images: string[];
}

export const GalleryImageGrid = ({ images }: ImageGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((imageUrl, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-0">
            <img
              src={imageUrl}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-48 object-cover"
              onError={(e) => {
                console.error('Image failed to load:', imageUrl);
                e.currentTarget.src = '/placeholder.svg';
                toast.error(`Failed to load image ${index + 1}`);
              }}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};