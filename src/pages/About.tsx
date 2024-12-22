import { useAboutContent } from "@/hooks/useAboutContent";
import { ActivityTypes } from "@/components/about/ActivityTypes";

export default function About() {
  const { content } = useAboutContent();

  return (
    <div className="min-h-screen bg-[#F1F0FB]">
      <div className="relative w-full min-h-[30vh] sm:min-h-[35vh] md:min-h-[40vh]">
        <img 
          src="https://images.unsplash.com/photo-1605723517503-3cadb5818a0c"
          alt="Jacksonville, Florida skyline at sunset"
          className="absolute inset-0 w-full h-full object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white">About Us</h1>
          <img 
            src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
            alt="OEA Logo"
            className="w-24 h-24 md:w-32 md:h-32 object-contain"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
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