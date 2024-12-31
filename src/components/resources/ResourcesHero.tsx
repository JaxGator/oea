import { Card } from "@/components/ui/card";

export function ResourcesHero() {
  return (
    <div className="relative w-full min-h-[30vh] sm:min-h-[35vh] md:min-h-[40vh]">
      <img
        src="https://images.unsplash.com/photo-1605723517503-3cadb5818a0c"
        alt="Downtown Jacksonville Skyline"
        className="absolute inset-0 w-full h-full object-cover object-bottom"
      />
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center space-y-6">
        <div className="text-white text-4xl md:text-5xl font-bold">
          Resources
        </div>
        <img 
          src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
          alt="OEA Logo"
          className="w-24 h-24 md:w-32 md:h-32 object-contain"
        />
      </div>
    </div>
  );
}