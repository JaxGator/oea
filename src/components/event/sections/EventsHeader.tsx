
import { CalendarDays, Plus } from "lucide-react";
import { DateFilter } from "@/components/DateFilter";
import { CreateEventDialog } from "@/components/CreateEventDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface EventsHeaderProps {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
  isAuthenticated: boolean;
  onCreateEvent: () => void;
}

export function EventsHeader({
  selectedDate,
  onDateSelect,
  isAuthenticated,
  onCreateEvent,
}: EventsHeaderProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <CalendarDays className="h-6 w-6" />
          Upcoming Events
        </h2>
        
        {isAuthenticated && (
          <Button 
            onClick={() => setShowCreateDialog(true)}
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <DateFilter
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
        />
      </div>
      
      <CreateEventDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => {
          setShowCreateDialog(false);
          onCreateEvent();
        }}
      />
    </div>
  );
}
