
import { useState } from "react";
import { toast } from "sonner";

interface UseGalleryImageValidationProps {
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export function useGalleryImageValidation({
  maxSizeMB = 5,
  allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
}: UseGalleryImageValidationProps = {}) {
  const [validating, setValidating] = useState(false);

  const validateImage = async (file: File): Promise<boolean> => {
    setValidating(true);

    try {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        const allowedExtensions = allowedTypes
          .map((type) => type.split("/")[1])
          .join(", ");
        toast.error(
          `Unsupported file type. Please upload ${allowedExtensions} files.`
        );
        return false;
      }

      // Check file size
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        toast.error(`File too large. Maximum size is ${maxSizeMB}MB.`);
        return false;
      }

      // Check image dimensions
      return new Promise((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
          URL.revokeObjectURL(objectUrl);

          // Check for minimum dimensions (e.g. 200x200)
          if (img.width < 200 || img.height < 200) {
            toast.error(
              "Image too small. Minimum dimensions are 200x200 pixels."
            );
            resolve(false);
            return;
          }

          // Check for maximum dimensions (e.g. 4000x4000)
          if (img.width > 4000 || img.height > 4000) {
            toast.error(
              "Image too large. Maximum dimensions are 4000x4000 pixels."
            );
            resolve(false);
            return;
          }

          resolve(true);
        };

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          toast.error("Invalid image file. Please try another file.");
          resolve(false);
        };

        img.src = objectUrl;
      });
    } catch (error) {
      console.error("Image validation error:", error);
      toast.error("Failed to validate image");
      return false;
    } finally {
      setValidating(false);
    }
  };

  return {
    validateImage,
    validating,
  };
}
