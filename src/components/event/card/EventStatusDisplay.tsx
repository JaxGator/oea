import React from 'react';

interface EventStatusDisplayProps {
  displayCount: number;
  maxGuests: number;
  isPastEvent: boolean;
  isWixEvent: boolean;
  isFull: boolean;
}

export function EventStatusDisplay({
  displayCount,
  maxGuests,
  isPastEvent,
  isWixEvent,
  isFull
}: EventStatusDisplayProps) {
  const spotsRemaining = Math.max(0, maxGuests - displayCount);

  return (
    <p>
      {displayCount} / {maxGuests} spots filled
      {!isPastEvent && spotsRemaining > 0 && !isFull && ` (${spotsRemaining} spots remaining)`}
      {isFull && " (Event Full)"}
      {isWixEvent && " (imported from Wix)"}
    </p>
  );
}