import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { EventCard } from "@/components/EventCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userRSVPs, setUserRSVPs] = useState<Record<string, string>>({});

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["featured-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          event_rsvps(count)
        `)
        .order('date', { ascending: true })
        .limit(4);

      if (error) throw error;

      return data.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description || "",
        date: event.date,
        time: event.time,
        location: event.location,
        attendees: event.event_rsvps?.[0]?.count || 0,
        maxAttendees: event.max_guests,
        imageUrl: event.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
      }));
    },
  });

  // Fetch user's RSVPs
  const fetchUserRSVPs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: rsvps, error } = await supabase
      .from("event_rsvps")
      .select("event_id, response")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching RSVPs:", error);
      return;
    }

    const rsvpMap = rsvps?.reduce((acc, rsvp) => ({
      ...acc,
      [rsvp.event_id]: rsvp.response
    }), {});

    setUserRSVPs(rsvpMap || {});
  };

  useEffect(() => {
    fetchUserRSVPs();
  }, []);

  const handleRSVP = async (eventId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to RSVP",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    navigate(`/events?rsvp=${eventId}`);
  };

  const handleCancelRSVP = async (eventId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to cancel your RSVP",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase
        .from("event_rsvps")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your RSVP has been cancelled",
      });

      await fetchUserRSVPs();
    } catch (error: any) {
      console.error("Error cancelling RSVP:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to cancel RSVP",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div 
        className="relative min-h-[30vh] sm:min-h-[35vh] md:min-h-[40vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(34, 34, 34, 0.8), rgba(34, 34, 34, 0.8)), url('https://static.wixstatic.com/media/47fb9c_51e5d1363f5b42c5ba456e7cba248196~mv2.jpg/v1/fill/w_1024,h_340,fp_0.50_0.50,q_80,enc_avif,quality_auto/47fb9c_51e5d1363f5b42c5ba456e7cba248196~mv2.jpg')`
        }}
      >
        <div className="container mx-auto text-center">
          <img 
            src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
            alt="Outdoor Energy Adventures Logo"
            className="w-48 sm:w-56 md:w-64 lg:w-80 mx-auto mb-6 sm:mb-8 animate-fade-in"
          />
        </div>
      </div>

      {/* Featured Events Section */}
      <section className="py-16 bg-[#222222]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
            <Button 
              onClick={() => navigate("/events")}
              variant="outline"
              className="bg-[#0d97d1] hover:bg-[#0d97d1]/90 text-white border-[#0d97d1] hover:border-[#0d97d1]/90"
            >
              View All Events
            </Button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8 text-white">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No upcoming events found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onRSVP={handleRSVP}
                  onCancelRSVP={handleCancelRSVP}
                  userRSVPStatus={userRSVPs[event.id]}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="mb-2">Email: info@outdoorenergyadventures.com</p>
              <p>Phone: (555) 123-4567</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><button onClick={() => navigate("/events")} className="hover:text-primary-100 transition-colors">Events</button></li>
                <li><button onClick={() => navigate("/about")} className="hover:text-primary-100 transition-colors">About Us</button></li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-primary-100 transition-colors">Facebook</a>
                <a href="#" className="hover:text-primary-100 transition-colors">Instagram</a>
                <a href="#" className="hover:text-primary-100 transition-colors">Twitter</a>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-700 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Outdoor Energy Adventures. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
