import { useState } from "react";
import { CreateEventDialog } from "@/components/CreateEventDialog";
import { DateFilter } from "@/components/DateFilter";
import { useEvents } from "@/hooks/useEvents";
import { EventList } from "@/components/event/EventList";
import { useRSVP } from "@/hooks/useRSVP";
import { toast } from "sonner";

export default function Events() {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  
  const { data: events = [], isLoading, error } = useEvents(selectedDate);
  const { handleRSVP, cancelRSVP } = useRSVP();

  if (error) {
    toast.error("Failed to load events. Please try again.");
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center">
        <div className="text-white">Error loading events. Please try again.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center">
        <div className="text-white">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#222222] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold text-white">Events</h1>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <DateFilter
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
            <CreateEventDialog
              open={isCreateEventOpen}
              onOpenChange={setIsCreateEventOpen}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <EventList 
            events={events}
            onRSVP={handleRSVP}
            onCancelRSVP={cancelRSVP}
          />
        </div>
      </div>
    </div>
  );
}