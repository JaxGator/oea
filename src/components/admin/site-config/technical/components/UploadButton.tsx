import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface UploadButtonProps {
  isUploading: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export function UploadButton({ isUploading, onChange }: UploadButtonProps) {
  return (
    <div className="flex gap-2">
      <Input
        type="file"
        accept="image/*"
        onChange={onChange}
        disabled={isUploading}
      />
      {isUploading && (
        <Button disabled>
          <Upload className="mr-2 h-4 w-4 animate-spin" />
          Uploading
        </Button>
      )}
    </div>
  );
}