import { EditableContent } from "@/components/EditableContent";

interface AboutContentProps {
  content: {
    guidelines: string;
    mission: string;
    guidelinesTitle: string;
    missionTitle: string;
  };
  isAuthenticated: boolean;
  onUpdate: (section: 'guidelines' | 'mission' | 'guidelinesTitle' | 'missionTitle', newContent: string) => void;
}

export function AboutContent({ content, isAuthenticated, onUpdate }: AboutContentProps) {
  if (isAuthenticated) {
    return (
      <>
        <div className="prose max-w-none bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="text-2xl font-semibold mb-4">
            <EditableContent
              content={content.guidelinesTitle}
              pageId="about"
              sectionId="guidelinesTitle"
              onUpdate={(newContent) => onUpdate('guidelinesTitle', newContent)}
            />
          </div>
          <EditableContent
            content={content.guidelines}
            pageId="about"
            sectionId="guidelines"
            onUpdate={(newContent) => onUpdate('guidelines', newContent)}
          />
        </div>
        <div className="prose max-w-none bg-white p-6 rounded-lg shadow-sm">
          <div className="text-2xl font-semibold mb-4">
            <EditableContent
              content={content.missionTitle}
              pageId="about"
              sectionId="missionTitle"
              onUpdate={(newContent) => onUpdate('missionTitle', newContent)}
            />
          </div>
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
        <h2 className="text-2xl font-semibold mb-4" dangerouslySetInnerHTML={{ __html: content.guidelinesTitle }} />
        <div dangerouslySetInnerHTML={{ __html: content.guidelines }} />
      </div>
      <div className="prose max-w-none bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4" dangerouslySetInnerHTML={{ __html: content.missionTitle }} />
        <div dangerouslySetInnerHTML={{ __html: content.mission }} />
      </div>
    </>
  );
}