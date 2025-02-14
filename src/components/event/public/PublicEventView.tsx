
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { EventLocationMap } from '../EventLocationMap';

export function PublicEventView() {
  const { token } = useParams();
  const navigate = useNavigate();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['shared-event', token],
    queryFn: async () => {
      console.log('Fetching event with share token:', token);
      
      const { data: eventData, error } = await supabase
        .from('events')
        .select(`
          id,
          title,
          description,
          date,
          time,
          location,
          max_guests,
          image_url,
          latitude,
          longitude,
          is_featured,
          share_token
        `)
        .eq('share_token', token)
        .single();

      if (error) {
        console.error('Error fetching event:', error);
        throw error;
      }
      
      if (!eventData) {
        console.error('Event not found for share token:', token);
        throw new Error('Event not found');
      }

      console.log('Found event:', eventData);
      return eventData;
    },
    enabled: !!token,
    retry: 1
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#222222] p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">Loading event details...</span>
          </div>
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    console.error('Error or no event:', error);
    return (
      <div className="min-h-screen bg-[#222222] p-4">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertDescription>
              Event not found or has been removed.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#222222]">
      <div className="max-w-4xl mx-auto p-4">
        <Button
          variant="ghost"
          className="text-white mb-4"
          onClick={() => navigate('/events')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>

        <div className="bg-white rounded-lg overflow-hidden">
          {event.image_url && (
            <div className="aspect-video w-full relative">
              <img
                src={event.image_url}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <div className="text-gray-600 space-y-2">
                <p>
                  {format(new Date(event.date), "EEEE, MMMM do, yyyy")} at {event.time}
                </p>
                <p>{event.location}</p>
              </div>
            </div>

            <div 
              className="prose prose-sm md:prose-base max-w-none"
              dangerouslySetInnerHTML={{ __html: event.description || "" }}
            />

            {event.latitude && event.longitude && (
              <div className="h-[400px] w-full rounded-lg overflow-hidden">
                <EventLocationMap 
                  lat={event.latitude} 
                  lng={event.longitude} 
                  location={event.location}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
