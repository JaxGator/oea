import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { EventsMap } from '../EventsMap';
import { Event } from '@/types/event';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyMapProps {
  events: Event[];
  selectedEventId?: string | null;
  isLoading?: boolean;
}

export function LazyMap({ events, selectedEventId, isLoading = false }: LazyMapProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
    rootMargin: '100px'
  });

  useEffect(() => {
    if (inView && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [inView, shouldLoad]);

  return (
    <div ref={ref} className="w-full h-[400px] rounded-lg overflow-hidden animate-fade-in">
      {shouldLoad ? (
        <EventsMap 
          events={events} 
          selectedEventId={selectedEventId} 
          isLoading={isLoading}
        />
      ) : (
        <Skeleton className="w-full h-full bg-gray-100" />
      )}
    </div>
  );
}