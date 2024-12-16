import { AboutHero } from "@/components/about/AboutHero";
import { AboutContent } from "@/components/about/AboutContent";
import { useAboutContent } from "@/hooks/useAboutContent";

export default function About() {
  const { content, user, handleContentUpdate } = useAboutContent();

  return (
    <div className="min-h-screen bg-[#F1F0FB]">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">About Us</h1>
        
        <div className="max-w-3xl mx-auto">
          <AboutHero 
            imageUrl="https://images.unsplash.com/photo-1490642914619-7955a3fd483c?q=80&w=2970&auto=format&fit=crop"
            imageAlt="Jacksonville, Florida skyline at sunset"
          />
          
          <div className="space-y-8">
            <AboutContent 
              content={content}
              isAuthenticated={!!user}
              onUpdate={handleContentUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}