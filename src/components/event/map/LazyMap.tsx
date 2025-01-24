import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { EventsMap } from '../EventsMap';
import { Event } from '@/types/event';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyMapProps {
  events: Event[];
  selectedEventId?: string | null;
}

export function LazyMap({ events, selectedEventId }: LazyMapProps) {
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
    <div ref={ref} className="w-full h-[400px] rounded-lg overflow-hidden">
      {shouldLoad ? (
        <EventsMap events={events} selectedEventId={selectedEventId} />
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </div>
  );
}