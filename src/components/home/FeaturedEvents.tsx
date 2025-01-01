import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { EventCard } from "@/components/EventCard";
import { useFeaturedEvents } from "@/hooks/useFeaturedEvents";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuthState } from "@/hooks/useAuthState";
import { ArrowRight } from "lucide-react";

export const FeaturedEvents = () => {
  const navigate = useNavigate();
  const { events, isLoading, userRSVPs, handleRSVP, handleCancelRSVP } = useFeaturedEvents();
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { user } = useAuthState();

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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
          <Button 
            onClick={() => navigate("/events")}
            variant="ghost"
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            View All Events
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8 text-gray-600">Loading events...</div>
        ) : upcomingEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No upcoming events found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onRSVP={handleRSVP}
                onCancelRSVP={handleCancelRSVP}
                userRSVPStatus={userRSVPs[event.id]}
              />
            ))}
          </div>
        )}

        {/* Photo Gallery Section */}
        <div className="mt-16 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Photo Gallery</h2>
          <Card>
            <CardContent className="p-4">
              {isLoadingImages ? (
                <div className="text-center py-8 text-gray-600">Loading gallery...</div>
              ) : galleryImages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No images found in the gallery.</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galleryImages.map((imageUrl, index) => (
                    <div 
                      key={index} 
                      className="aspect-square overflow-hidden rounded-lg cursor-pointer"
                      onClick={() => setSelectedImage(imageUrl)}
                    >
                      <img
                        src={imageUrl}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Full size gallery image"
                className="w-full h-full object-contain"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};