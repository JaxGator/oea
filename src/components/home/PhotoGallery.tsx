import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuthState } from '@/hooks/useAuthState';

export const PhotoGallery = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const { user, profile } = useAuthState();
  const isAdmin = profile?.is_admin;

  const { data: images, refetch } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      const { data: files, error } = await supabase.storage
        .from('gallery')
        .list();
      
      if (error) throw error;
      
      return files.map(file => ({
        name: file.name,
        url: `${supabase.storage.from('gallery').getPublicUrl(file.name).data.publicUrl}`
      }));
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageName: string) => {
    try {
      const { error } = await supabase.storage
        .from('gallery')
        .remove([imageName]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image deleted successfully",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Photo Gallery</h2>
          {isAdmin && (
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="gallery-upload"
                disabled={uploading}
              />
              <label htmlFor="gallery-upload">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  disabled={uploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </Button>
              </label>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images?.map((image) => (
            <div key={image.name} className="relative group">
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              {isAdmin && (
                <button
                  onClick={() => handleDelete(image.name)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};