
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UploadCloud } from "lucide-react";
import { useSession } from "@/hooks/auth/useSession";
import { useGalleryUpload } from "@/hooks/useGalleryUpload";
import { toast } from "@/hooks/use-toast";

interface ImageUploadFormProps {
  onUploadComplete: () => void;
}

export function ImageUploadForm({ onUploadComplete }: ImageUploadFormProps) {
  const { user, profile } = useSession();
  const { isUploading, uploadImage } = useGalleryUpload(onUploadComplete);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type:', file.type);
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      console.error('File too large:', {
        size: file.size,
        maxSize
      });
      toast({
        title: "File Too Large",
        description: "Please select an image under 5MB",
        variant: "destructive",
      });
      return;
    }

    await uploadImage(file);
    event.target.value = '';
  };

  if (!user || !profile?.is_admin) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="image">Upload Image</Label>
        <div className="flex gap-2">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="cursor-pointer"
          />
          <Button disabled={isUploading} variant="outline">
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}
    </div>
  );
}
