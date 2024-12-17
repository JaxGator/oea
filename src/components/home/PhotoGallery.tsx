import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

export const PhotoGallery = () => {
  console.log('PhotoGallery component mounting...');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      console.log('Fetching images...');
      try {
        const { data: files, error: listError } = await supabase
          .storage
          .from('gallery')
          .list();

        console.log('Supabase response:', { files, listError });

        if (listError) {
          console.error('Error listing files:', listError);
          setError('Failed to fetch images');
          setIsLoading(false);
          return;
        }

        if (!files || files.length === 0) {
          console.log('No images found');
          setImages([]);
          setIsLoading(false);
          return;
        }

        const imageUrls = files
          .filter(file => file.name.match(/\.(jpg|jpeg|png|gif)$/i))
          .map(file => `https://qegpuqitjfocyyrivlhv.supabase.co/storage/v1/object/public/gallery/${file.name}`);

        console.log('Generated image URLs:', imageUrls);
        setImages(imageUrls);
        setIsLoading(false);
      } catch (error) {
        console.error('Unexpected error:', error);
        setError('An unexpected error occurred');
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="space-y-4 border-2 border-green-500 p-4 rounded-lg">
      <div className="bg-yellow-100 p-2 rounded">
        <p>Debug: PhotoGallery component</p>
        <p>Loading: {isLoading ? 'true' : 'false'}</p>
        <p>Error: {error || 'none'}</p>
        <p>Images count: {images.length}</p>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 py-8">
          {error}
        </div>
      )}

      {!isLoading && !error && images.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No images available in the gallery
        </div>
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