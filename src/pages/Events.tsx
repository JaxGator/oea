
import React from 'react';
import { EventsHeader } from '@/components/event/sections/EventsHeader';
import { EventsContent } from '@/components/event/sections/EventsContent';
import { useEvents } from '@/hooks/useEvents';
import { useRSVPManagement } from '@/hooks/events/useRSVPManagement';
import { useAuthState } from '@/hooks/useAuthState';

export default function Events() {
  // Remove any arguments from useEvents call
  const { 
    data: events = [], 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useEvents();
  
  const { userRSVPs, handleRSVP, handleCancelRSVP } = useRSVPManagement();
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthState();

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <EventsHeader />
      <EventsContent 
        events={events.flatMap(page => page.data)} 
        isLoading={isLoading}
        onLoadMore={handleLoadMore}
        hasMore={!!hasNextPage}
        isLoadingMore={isFetchingNextPage}
        userRSVPs={userRSVPs}
        isAuthLoading={isAuthLoading}
        isAuthenticated={isAuthenticated}
        handleRSVP={handleRSVP}
        handleCancelRSVP={handleCancelRSVP}
      />
    </div>
  );
}
