import { useState } from "react";
import { CreateEventDialog } from "@/components/CreateEventDialog";
import { DateFilter } from "@/components/DateFilter";
import { useEvents } from "@/hooks/useEvents";
import { EventList } from "@/components/event/EventList";
import { EventsMap } from "@/components/event/EventsMap";
import { useRSVP } from "@/hooks/useRSVP";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useAuthState } from "@/hooks/useAuthState";
import { Loader2 } from "lucide-react";

export default function Events() {
  const { isAuthenticated } = useAuthState();
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  
  const { data: events = [], isLoading: isEventsLoading, error } = useEvents(selectedDate);
  const { handleRSVP, cancelRSVP } = useRSVP();

  if (isEventsLoading) {
    return (
      <div className="min-h-screen bg-[#F1F0FB] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    toast.error("Failed to load events. Please try again.");
    return (
      <div className="min-h-screen bg-[#F1F0FB] flex items-center justify-center">
        <div className="text-black">Error loading events. Please try again.</div>
      </div>
    );
  }

  // Separate past and upcoming events
  const now = new Date();
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = events
    .filter(event => new Date(event.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-[#F1F0FB]">
      <div className="sticky top-0 z-10 bg-[#F1F0FB] border-b border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex justify-center">
          <h1 className="text-2xl md:text-3xl font-bold text-black">Events</h1>
        </div>
      </div>

      <div className="px-4 pb-20 md:pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              <DateFilter
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
              {isAuthenticated && (
                <CreateEventDialog
                  open={isCreateEventOpen}
                  onOpenChange={setIsCreateEventOpen}
                />
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold mb-4">Upcoming Events</h2>
                {upcomingEvents.length > 0 && (
                  <EventsMap events={upcomingEvents} />
                )}
                <EventList 
                  events={upcomingEvents}
                  onRSVP={handleRSVP}
                  onCancelRSVP={cancelRSVP}
                />
              </div>

              {pastEvents.length > 0 && (
                <>
                  <Separator className="my-8" />
                  <div>
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">Past Events</h2>
                    <EventList 
                      events={pastEvents}
                      onRSVP={handleRSVP}
                      onCancelRSVP={cancelRSVP}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}