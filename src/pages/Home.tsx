import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
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
          <Button
            onClick={() => navigate("/events")}
            size="lg"
            className="animate-fade-in text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3"
          >
            Explore Events
          </Button>
        </div>
      </div>
    </div>
  );
}