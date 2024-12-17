import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export const PhotoGallery = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      console.log('Starting image fetch process...');
      try {
        // Test Supabase connection
        const { data: testData, error: testError } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);
        
        console.log('Supabase connection test:', { testData, testError });

        if (testError) {
          throw new Error('Supabase connection failed');
        }

        // Fetch images from gallery bucket
        const { data: files, error: listError } = await supabase
          .storage
          .from('gallery')
          .list('', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
          });

        console.log('Storage list response:', { files, listError });

        if (listError) {
          throw new Error(`Failed to list files: ${listError.message}`);
        }

        if (!files || files.length === 0) {
          console.log('No images found in gallery bucket');
          setImages([]);
          setIsLoading(false);
          return;
        }

        // Filter and validate image URLs
        const imageUrls = files
          .filter(file => {
            const isImage = file.name.match(/\.(jpg|jpeg|png|gif)$/i);
            console.log(`File ${file.name} is image: ${!!isImage}`);
            return isImage;
          })
          .map(file => {
            const url = supabase.storage
              .from('gallery')
              .getPublicUrl(file.name);
            console.log(`Generated URL for ${file.name}:`, url);
            return url.data.publicUrl;
          });

        console.log('Final image URLs:', imageUrls);
        setImages(imageUrls);
        toast.success(`Loaded ${imageUrls.length} images`);
      } catch (error) {
        console.error('Gallery error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
        toast.error(`Failed to load gallery: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="space-y-4 border-2 border-blue-500 p-4 rounded-lg">
      <h2 className="text-2xl font-bold">Photo Gallery</h2>
      
      <div className="bg-yellow-100 p-2 rounded">
        <p>Debug Information:</p>
        <ul className="list-disc pl-4">
          <li>Loading: {isLoading ? 'true' : 'false'}</li>
          <li>Error: {error || 'none'}</li>
          <li>Images found: {images.length}</li>
          <li>Supabase Config: {process.env.SUPABASE_URL || 'Not available'}</li>
        </ul>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <Card className="bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && images.length === 0 && (
        <Card>
          <CardContent className="p-4 text-center text-gray-500">
            No images available in the gallery
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && images.length > 0 && (
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
      )}
    </div>
  );
}