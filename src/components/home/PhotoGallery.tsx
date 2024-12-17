import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

export const PhotoGallery = () => {
  console.log('PhotoGallery component - Initial render'); // Debug log

  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      console.log('PhotoGallery - Fetching images...'); // Debug log
      try {
        const { data: files, error: listError } = await supabase
          .storage
          .from('gallery')
          .list();

        console.log('Supabase response:', { files, listError }); // Debug log

        if (listError) {
          console.error('Error listing files:', listError);
          setError('Failed to fetch images');
          setIsLoading(false);
          return;
        }

        if (!files || files.length === 0) {
          console.log('No files found in gallery bucket');
          setImages([]);
          setIsLoading(false);
          return;
        }

        const imageFiles = files.filter(file => 
          file.name.match(/\.(jpg|jpeg|png|gif)$/i)
        );
        
        console.log('Filtered image files:', imageFiles);

        const imageUrls = imageFiles.map(file => 
          `https://qegpuqitjfocyyrivlhv.supabase.co/storage/v1/object/public/gallery/${file.name}`
        );

        console.log('Generated image URLs:', imageUrls);
        setImages(imageUrls);
      } catch (error) {
        console.error('Unexpected error:', error);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  console.log('PhotoGallery render state:', { isLoading, error, imageCount: images.length }); // Debug log

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="flex justify-center items-center min-h-[200px] border border-dashed border-gray-300 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="text-center text-red-500 py-8 border border-dashed border-red-300 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Photo Gallery</h2>
      {images.length === 0 ? (
        <div className="text-center text-gray-500 py-8 border border-dashed border-gray-300 rounded-lg">
          No images available in the gallery
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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