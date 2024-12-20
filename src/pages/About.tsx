import { AboutHero } from "@/components/about/AboutHero";
import { AboutContent } from "@/components/about/AboutContent";
import { ActivityTypes } from "@/components/about/ActivityTypes";
import { useAboutContent } from "@/hooks/useAboutContent";

export default function About() {
  const { content } = useAboutContent();

  return (
    <div className="min-h-screen bg-[#F1F0FB]">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">About Us</h1>
        
        <div className="max-w-3xl mx-auto">
          <AboutHero 
            imageUrl="https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?q=80&w=2970&auto=format&fit=crop"
            imageAlt="Jacksonville, Florida skyline at sunset"
          />
          
          <div className="prose max-w-none bg-white p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-2xl font-semibold mb-4" dangerouslySetInnerHTML={{ __html: content.missionTitle }} />
            <div dangerouslySetInnerHTML={{ __html: content.mission }} />
          </div>

          <ActivityTypes />
          
          <div className="prose max-w-none bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4" dangerouslySetInnerHTML={{ __html: content.guidelinesTitle }} />
            <div dangerouslySetInnerHTML={{ __html: content.guidelines }} />
          </div>
        </div>
      </div>
    </div>
  );
}