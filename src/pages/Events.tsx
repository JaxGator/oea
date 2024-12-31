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
import { GroupChat } from "@/components/chat/GroupChat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { Button } from "@/components/ui/button";

export default function Events() {
  const { isAuthenticated } = useAuthState();
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  
  const { data: events = [], isLoading: isEventsLoading, error } = useEvents(selectedDate);
  const { handleRSVP, cancelRSVP } = useRSVP();

  if (error) {
    console.error("Events loading error:", error);
    toast.error("Failed to load events. Please try again.");
    return (
      <div className="min-h-screen bg-[#F1F0FB] flex items-center justify-center">
        <div className="text-black">Error loading events. Please try again.</div>
      </div>
    );
  }

  const now = new Date();
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = events
    .filter(event => new Date(event.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (isEventsLoading) {
    return (
      <div className="min-h-screen bg-[#F1F0FB] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F0FB]">
      <div className="px-4 pb-20 md:pb-12">
        <Tabs defaultValue="events" className="w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Events</h1>
          </div>
          
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="discussion">Event Discussion</TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <div className="flex items-center gap-4 mb-8">
              <DateFilter
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
              {isAuthenticated && (
                <Button 
                  onClick={() => setIsCreateEventOpen(true)}
                  className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
                >
                  Create Event
                </Button>
              )}
            </div>

            <div className="bg-white rounded-lg p-6 space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>
                {upcomingEvents.length > 0 && (
                  <div className="mb-8">
                    <ErrorBoundary fallback={<div>Error loading map. Please try again later.</div>}>
                      <EventsMap events={upcomingEvents} />
                    </ErrorBoundary>
                  </div>
                )}
                <ErrorBoundary fallback={<div>Error loading events. Please try again later.</div>}>
                  <EventList 
                    events={upcomingEvents}
                    onRSVP={handleRSVP}
                    onCancelRSVP={cancelRSVP}
                  />
                </ErrorBoundary>
              </div>

              {pastEvents.length > 0 && (
                <>
                  <Separator className="my-8" />
                  <div>
                    <h2 className="text-2xl font-semibold mb-6">Past Events</h2>
                    <ErrorBoundary fallback={<div>Error loading past events. Please try again later.</div>}>
                      <EventList 
                        events={pastEvents}
                        onRSVP={handleRSVP}
                        onCancelRSVP={cancelRSVP}
                      />
                    </ErrorBoundary>
                  </div>
                </>
              )}
            </div>

            <CreateEventDialog
              open={isCreateEventOpen}
              onOpenChange={setIsCreateEventOpen}
            />
          </TabsContent>

          <TabsContent value="discussion">
            <div className="bg-white rounded-lg shadow-lg">
              <ErrorBoundary fallback={<div>Error loading chat. Please try again later.</div>}>
                <GroupChat />
              </ErrorBoundary>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}