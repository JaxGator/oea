import { AboutHero } from "@/components/about/AboutHero";
import { AboutContent } from "@/components/about/AboutContent";
import { ActivityTypes } from "@/components/about/ActivityTypes";
import { useAboutContent } from "@/hooks/useAboutContent";

export default function About() {
  const { content } = useAboutContent();

  return (
    <div className="min-h-screen bg-[#F1F0FB]">
      <div className="relative w-full mb-12">
        <div className="aspect-[21/9] w-full">
          <img 
            src="https://images.unsplash.com/photo-1605723517503-3cadb5818a0c"
            alt="Jacksonville, Florida skyline at sunset"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <img 
              src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
              alt="OEA Logo"
              className="w-48 h-48 md:w-64 md:h-64 object-contain"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">About Us</h1>
        
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="prose max-w-none bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6" dangerouslySetInnerHTML={{ __html: content.missionTitle }} />
            <div className="text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: content.mission }} />
          </div>

          <ActivityTypes />
          
          <div className="prose max-w-none bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6" dangerouslySetInnerHTML={{ __html: content.guidelinesTitle }} />
            <div className="text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: content.guidelines }} />
          </div>
        </div>
      </div>
    </div>
  );
}