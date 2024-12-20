import { EditableContent } from "@/components/EditableContent";

interface AboutContentProps {
  content: {
    guidelines: string;
    mission: string;
  };
  isAuthenticated: boolean;
  onUpdate: (section: 'guidelines' | 'mission', newContent: string) => void;
}

export function AboutContent({ content, isAuthenticated, onUpdate }: AboutContentProps) {
  if (isAuthenticated) {
    return (
      <>
        <div className="prose max-w-none bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-2xl font-semibold mb-4">Guidelines</h2>
          <EditableContent
            content={content.guidelines}
            pageId="about"
            sectionId="guidelines"
            onUpdate={(newContent) => onUpdate('guidelines', newContent)}
          />
        </div>
        <div className="prose max-w-none bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <EditableContent
            content={content.mission}
            pageId="about"
            sectionId="mission"
            onUpdate={(newContent) => onUpdate('mission', newContent)}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="prose max-w-none bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-2xl font-semibold mb-4">Guidelines</h2>
        <div dangerouslySetInnerHTML={{ __html: content.guidelines }} />
      </div>
      <div className="prose max-w-none bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <div dangerouslySetInnerHTML={{ __html: content.mission }} />
      </div>
    </>
  );
}