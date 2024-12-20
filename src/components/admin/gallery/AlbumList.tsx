import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GalleryAlbum } from "./types/gallery";
import { Button } from "@/components/ui/button";
import { ImageUploadForm } from "./ImageUploadForm";
import { GalleryGridContainer } from "./GalleryGridContainer";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";

interface AlbumListProps {
  onImageDelete: (imageUrl: string) => void;
}

export function AlbumList({ onImageDelete }: AlbumListProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [images, setImages] = useState<Array<{ url: string; id: string }>>([]);

  const { data: albums } = useQuery({
    queryKey: ['albums'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_albums')
        .select('*, events(title)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (GalleryAlbum & { events: { title: string } | null })[];
    }
  });

  const fetchAlbumImages = async (folderPath: string) => {
    const { data: storageData, error: storageError } = await supabase.storage
      .from('gallery')
      .list(folderPath);

    if (storageError) throw storageError;

    const imageUrls = storageData
      .filter(file => file.name.match(/\.(jpg|jpeg|png|gif)$/i))
      .map(file => ({
        id: file.name,
        url: supabase.storage.from('gallery').getPublicUrl(`${folderPath}/${file.name}`).data.publicUrl
      }));

    setImages(imageUrls);
  };

  const handleAlbumSelect = async (album: GalleryAlbum) => {
    setSelectedAlbum(album);
    await fetchAlbumImages(album.folder_path);
  };

  const handleBackClick = () => {
    setSelectedAlbum(null);
    setImages([]);
  };

  if (selectedAlbum) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBackClick}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Albums
          </Button>
          <h2 className="text-xl font-semibold">{selectedAlbum.title}</h2>
        </div>
        
        <Separator />
        
        <ImageUploadForm 
          onUploadSuccess={() => fetchAlbumImages(selectedAlbum.folder_path)} 
          folderPath={selectedAlbum.folder_path}
        />
        
        <GalleryGridContainer 
          images={images} 
          onImageDelete={onImageDelete}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {albums?.map((album) => (
        <div
          key={album.id}
          className="border rounded-lg p-4 space-y-2 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => handleAlbumSelect(album)}
        >
          <h3 className="font-semibold">{album.title}</h3>
          {album.description && (
            <p className="text-sm text-gray-600">{album.description}</p>
          )}
          {album.events && (
            <p className="text-sm text-gray-500">Event: {album.events.title}</p>
          )}
        </div>
      ))}
    </div>
  );
}