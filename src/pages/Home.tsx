import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { EventCard } from "@/components/EventCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Home() {
  const navigate = useNavigate();

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

  const handleRSVP = async (eventId: string) => {
    navigate(`/events?rsvp=${eventId}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <div 
        className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat"
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
              className="text-white hover:text-[#0d97d1] border-white hover:border-[#0d97d1]"
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
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-[#222222] text-white py-12">
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
                <li><button onClick={() => navigate("/events")} className="hover:text-[#0d97d1] transition-colors">Events</button></li>
                <li><button onClick={() => navigate("/about")} className="hover:text-[#0d97d1] transition-colors">About Us</button></li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-[#0d97d1] transition-colors">Facebook</a>
                <a href="#" className="hover:text-[#0d97d1] transition-colors">Instagram</a>
                <a href="#" className="hover:text-[#0d97d1] transition-colors">Twitter</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Outdoor Energy Adventures. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
