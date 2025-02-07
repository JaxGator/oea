import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useSession } from "@/hooks/auth/useSession";
import { useGalleryUpload } from "@/hooks/useGalleryUpload";

interface ImageUploadFormProps {
  onUploadComplete: () => void;
}

export function ImageUploadForm({ onUploadComplete }: ImageUploadFormProps) {
  const { user, profile } = useSession();
  const { isUploading, uploadImage } = useGalleryUpload(onUploadComplete);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
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
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
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