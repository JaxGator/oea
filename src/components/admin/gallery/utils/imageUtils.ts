
import { toast } from "sonner";

export async function handleImageDelete(imageUrl: string, onSuccess: (imageUrl: string) => void) {
  try {
    // Extract the filename from the URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];

    if (!fileName) {
      throw new Error('Invalid image URL');
    }

    // Use the API endpoint instead of direct database access
    const response = await fetch('/api/gallery/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete image');
    }

    onSuccess(imageUrl);
    toast.success("Image deleted successfully");
  } catch (error) {
    console.error('Error deleting image:', error);
    toast.error(error instanceof Error ? error.message : "Failed to delete image");
  }
}
