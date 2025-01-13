interface EventMetadataProps {
  maxGuests: number;
  rsvpCount: number;
  isPublished?: boolean;
  isPastEvent?: boolean;
}

export function EventMetadata({ 
  maxGuests, 
  rsvpCount, 
  isPublished = true,
  isPastEvent = false 
}: EventMetadataProps) {
  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      {!isPastEvent && (
        <span>
          {rsvpCount}/{maxGuests} spots filled
        </span>
      )}
      {!isPublished && (
        <span className="text-yellow-600 font-medium">
          (Unpublished)
        </span>
      )}
    </div>
  );
}