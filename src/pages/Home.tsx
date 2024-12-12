import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-gradient-to-r from-primary-100 to-primary-200 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Welcome to Evently
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto animate-fade-in">
            Discover and join amazing events in your community
          </p>
          <Button
            onClick={() => navigate("/events")}
            size="lg"
            className="animate-fade-in"
          >
            Explore Events
          </Button>
        </div>
      </div>

      {/* Featured Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <h3 className="text-xl font-semibold mb-4">Community First</h3>
            <p className="text-gray-600">
              Join a vibrant community of like-minded individuals
            </p>
          </div>
          <div className="text-center p-6">
            <h3 className="text-xl font-semibold mb-4">Diverse Events</h3>
            <p className="text-gray-600">
              From workshops to social gatherings, find your perfect event
            </p>
          </div>
          <div className="text-center p-6">
            <h3 className="text-xl font-semibold mb-4">Easy to Join</h3>
            <p className="text-gray-600">
              Simple RSVP process and event management
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}