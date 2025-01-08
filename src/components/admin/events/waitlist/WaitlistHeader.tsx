interface WaitlistHeaderProps {
  stats: {
    waitlistCount: number;
    waitlistCapacity: number | null;
    currentRSVPs?: number;
    maxGuests: number;
  };
}

export function WaitlistHeader({ stats }: WaitlistHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">Waitlist Management</h3>
        <p className="text-sm text-muted-foreground">
          {stats.waitlistCount} people waiting
          {stats.waitlistCapacity && ` (Capacity: ${stats.waitlistCapacity})`}
        </p>
      </div>
      <div className="text-sm text-muted-foreground">
        {stats.currentRSVPs}/{stats.maxGuests} spots filled
      </div>
    </div>
  );
}