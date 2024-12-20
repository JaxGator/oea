interface AboutContentProps {
  content: {
    guidelines: string;
    mission: string;
    guidelinesTitle: string;
    missionTitle: string;
  };
}

export function AboutContent({ content }: AboutContentProps) {
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