
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface GalleryItemProps {
  imageUrl: string;
  imageId: string;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function GalleryItem({ imageUrl, imageId, onDelete, isDeleting = false }: GalleryItemProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  return (
    <div 
      className="relative aspect-square touch-manipulation"
      onTouchStart={() => setShowActions(true)}
      onTouchEnd={() => setTimeout(() => setShowActions(false), 2000)}
    >
      {!isLoaded && (
        <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
      
      <img
        src={imageUrl}
        alt={`Gallery image ${imageId}`}
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          console.error('Failed to load image:', imageUrl);
          e.currentTarget.src = '/placeholder.svg';
          setIsLoaded(true);
        }}
      />
      
      {isLoaded && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              disabled={isDeleting}
              className={`absolute top-2 right-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity ${
                showActions ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Image</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this image? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
