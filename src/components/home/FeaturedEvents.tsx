import React, { useState, useEffect } from 'react';
import { useFeaturedEvents } from "@/hooks/useFeaturedEvents";
import { supabase } from "@/integrations/supabase/client";
import { UpcomingEventsSection } from "./UpcomingEventsSection";
import { GallerySection } from "./GallerySection";

export const FeaturedEvents = () => {
  const { events, isLoading, userRSVPs, handleRSVP, handleCancelRSVP } = useFeaturedEvents();
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Filter out past events and limit to 4 upcoming events
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate >= today;
    })
    .slice(0, 4);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const { data: files, error } = await supabase
        .storage
        .from('gallery')
        .list();

      if (error) {
        console.error('Error fetching gallery images:', error);
        return;
      }

      const imageUrls = files
        ?.filter(file => file.name.match(/\.(jpg|jpeg|png|gif)$/i))
        .map(file => {
          const { data: { publicUrl } } = supabase
            .storage
            .from('gallery')
            .getPublicUrl(file.name);
          return publicUrl;
        }) || [];

      setGalleryImages(imageUrls);
    } catch (error) {
      console.error('Error processing gallery images:', error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  return (
    <section className="py-16 bg-[#F1F0FB]">
      <div className="container mx-auto px-4">
        <UpcomingEventsSection 
          events={upcomingEvents}
          userRSVPs={userRSVPs}
          handleRSVP={handleRSVP}
          handleCancelRSVP={handleCancelRSVP}
          isLoading={isLoading}
        />
        
        <GallerySection 
          images={galleryImages}
          isLoading={isLoadingImages}
          selectedImage={selectedImage}
          onImageSelect={setSelectedImage}
          onImageDeselect={() => setSelectedImage(null)}
        />
      </div>
    </section>
  );
};