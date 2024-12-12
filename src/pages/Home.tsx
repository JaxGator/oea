import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-gradient-to-r from-primary-100 to-primary-200 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <img 
            src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
            alt="Outdoor Energy Adventures Logo"
            className="w-64 md:w-80 mx-auto mb-8 animate-fade-in"
          />
          <Button
            onClick={() => navigate("/events")}
            size="lg"
            className="animate-fade-in"
          >
            Explore Events
          </Button>
        </div>
      </div>
    </div>
  );
}