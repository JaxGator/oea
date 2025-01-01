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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { user } = useAuthState();

  // Filter out past events and limit to 2 upcoming events as shown in mockup
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate >= today;
    })
    .slice(0, 2);

  return (
    <section className="py-8 bg-[#F8F7FD]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Photo Gallery</h2>
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 16 }).map((_, index) => (
                  <div 
                    key={index} 
                    className="aspect-square overflow-hidden rounded-lg cursor-pointer group"
                    onClick={() => setSelectedImage(`gallery-image-${index + 1}`)}
                  >
                    <img
                      src={`/gallery/image-${index + 1}.jpg`}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
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