import { useAboutContent } from "@/hooks/useAboutContent";
import { ActivityTypes } from "@/components/about/ActivityTypes";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutContent } from "@/components/about/AboutContent";

export default function About() {
  const { content } = useAboutContent();

  return (
    <div className="min-h-screen bg-[#F1F0FB]">
      <AboutHero 
        imageUrl="https://images.unsplash.com/photo-1605723517503-3cadb5818a0c"
        imageAlt="Downtown Jacksonville Skyline"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="prose max-w-none bg-white p-8 rounded-lg shadow-sm animate-fade-in">
            <div 
              className="text-2xl font-semibold mb-6 tracking-tight"
              dangerouslySetInnerHTML={{ __html: content.missionTitle }}
            />
            <div 
              className="text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content.mission }}
            />
          </div>
          
          <ActivityTypes />

          <div className="prose max-w-none bg-white p-8 rounded-lg shadow-sm animate-fade-in">
            <div 
              className="text-2xl font-semibold mb-6 tracking-tight"
            >
              Group Guidelines
            </div>
            <div 
              className="text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content.guidelines }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}