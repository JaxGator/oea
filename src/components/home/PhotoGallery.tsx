import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

export const PhotoGallery = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        console.log('Starting to fetch images from gallery bucket...');
        
        // First, check if we can access the bucket
        const { data: bucketInfo, error: bucketError } = await supabase
          .storage
          .getBucket('gallery');
          
        if (bucketError) {
          console.error('Error accessing gallery bucket:', bucketError);
          setError('Failed to access gallery bucket');
          return;
        }
        
        console.log('Successfully accessed gallery bucket:', bucketInfo);

        // Then list the files
        const { data: files, error: listError } = await supabase
          .storage
          .from('gallery')
          .list('', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (listError) {
          console.error('Error listing files:', listError);
          setError('Failed to fetch images');
          return;
        }

        console.log('Files retrieved from bucket:', files);

        if (!files || files.length === 0) {
          console.log('No files found in gallery bucket');
          setImages([]);
          return;
        }

        // Filter and map to public URLs
        const imageFiles = files.filter(file => file.name.match(/\.(jpg|jpeg|png|gif)$/i));
        console.log('Filtered image files:', imageFiles);

        const imageUrls = imageFiles.map(file => {
          const { data } = supabase
            .storage
            .from('gallery')
            .getPublicUrl(file.name);
          console.log(`Generated URL for ${file.name}:`, data.publicUrl);
          return data.publicUrl;
        });

        console.log('Final image URLs:', imageUrls);
        setImages(imageUrls);
      } catch (error) {
        console.error('Unexpected error in fetchImages:', error);
        setError('An unexpected error occurred while fetching images');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        {error}
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Photo Gallery</h2>
        {images.length === 0 ? (
          <p className="text-center text-gray-500">No images available in the gallery</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((imageUrl, index) => (
              <Card key={index} className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <img
                    src={imageUrl}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
    </section>
  );
};