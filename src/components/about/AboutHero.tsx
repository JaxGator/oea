
import { cn } from "@/lib/utils";

interface AboutHeroProps {
  imageUrl: string;
  imageAlt: string;
}

export function AboutHero({ imageUrl, imageAlt }: AboutHeroProps) {
  return (
    <div className="relative w-full bg-[#F1F0FB]">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto relative h-[35vh] sm:h-[40vh] md:h-[45vh] overflow-hidden">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center space-y-6">
            <h1 className={cn(
              "text-4xl md:text-5xl font-bold text-white tracking-tight",
              "animate-fade-in"
            )}>
              About Us
            </h1>
            <img 
              src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
              alt="OEA Logo"
              className={cn(
                "w-24 h-24 md:w-32 md:h-32 object-contain",
                "animate-scale-in"
              )}
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
