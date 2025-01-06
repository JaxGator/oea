import { useAboutContent } from "@/hooks/useAboutContent";
import { ActivityTypes } from "@/components/about/ActivityTypes";
import { AboutContent } from "@/components/about/AboutContent";
import { AboutHero } from "@/components/about/AboutHero";

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
          <AboutContent content={content} />
          <ActivityTypes />
        </div>
      </div>
    </div>
  );
}