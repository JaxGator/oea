
import { useEffect, useRef } from 'react';
import { Event } from '@/types/event';
import { Location } from '@/hooks/useEventLocations';
import mapboxgl from 'mapbox-gl';
import { format } from 'date-fns';

interface EventPopupProps {
  event: Event;
  locations: Location[];
  onClose: () => void;
  map: mapboxgl.Map;
}

export function EventPopup({ event, locations, onClose, map }: EventPopupProps) {
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const position = locations.find(loc => loc.event.id === event.id) || locations[0];

  useEffect(() => {
    if (!map || !position) return;

    const container = document.createElement('div');
    container.className = 'p-4 min-w-[250px]';

    // Format the time string to 12-hour format
    const timeString = format(new Date(`2000-01-01T${event.time}`), 'h:mm a');

    container.innerHTML = `
      <h3 class="font-semibold mb-2">${event.title}</h3>
      <div class="space-y-2 mb-4">
        <div class="flex items-center text-sm text-muted-foreground">
          <span class="mr-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg></span>
          <span>${format(new Date(event.date), "EEEE, MMMM do, yyyy")}</span>
        </div>
        <div class="flex items-center text-sm text-muted-foreground">
          <span class="mr-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
          <span>${timeString}</span>
        </div>
        <div class="flex items-center text-sm text-muted-foreground">
          <span class="mr-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></span>
          <span>${event.location}</span>
        </div>
      </div>
    `;

    const buttonContainer = document.createElement('div');
    const button = document.createElement('button');
    button.className = 'w-full px-4 py-2 text-sm font-medium border rounded-md shadow-sm hover:bg-gray-50 flex items-center justify-center';
    button.innerHTML = `
      <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
      Get Directions
    `;
    button.onclick = () => {
      const destination = encodeURIComponent(event.location);
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
    };
    buttonContainer.appendChild(button);
    container.appendChild(buttonContainer);

    popupRef.current = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      maxWidth: '300px'
    })
      .setLngLat([position.lng, position.lat])
      .setDOMContent(container)
      .addTo(map);

    popupRef.current.on('close', onClose);

    return () => {
      popupRef.current?.remove();
    };
  }, [event, position, map, onClose]);

  return null;
}
