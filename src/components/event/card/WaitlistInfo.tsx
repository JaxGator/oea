import React from 'react';

interface WaitlistInfoProps {
  waitlistEnabled?: boolean;
  waitlistCount?: number;
  waitlistCapacity?: number | null;
}

export function WaitlistInfo({
  waitlistEnabled,
  waitlistCount = 0,
  waitlistCapacity
}: WaitlistInfoProps) {
  if (!waitlistEnabled) return null;

  return (
    <p className="text-gray-600">
      Waitlist: {waitlistCount} {waitlistCapacity ? `/ ${waitlistCapacity}` : ''} people
    </p>
  );
}