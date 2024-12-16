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
        <EditableContent
          content={content.guidelines}
          pageId="about"
          sectionId="guidelines"
          onUpdate={(newContent) => onUpdate('guidelines', newContent)}
        />
        <EditableContent
          content={content.mission}
          pageId="about"
          sectionId="mission"
          onUpdate={(newContent) => onUpdate('mission', newContent)}
        />
      </>
    );
  }

  return (
    <>
      <div className="prose max-w-none whitespace-pre-wrap bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Guidelines</h2>
        {content.guidelines}
      </div>
      <div className="prose max-w-none whitespace-pre-wrap bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        {content.mission}
      </div>
    </>
  );
}