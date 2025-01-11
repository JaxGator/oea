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
      <div className="prose max-w-none bg-white p-8 rounded-lg shadow-sm animate-fade-in">
        <h2 className="text-2xl font-semibold mb-6">{content.missionTitle}</h2>
        <div 
          className="text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content.mission }}
        />
      </div>

      <div className="prose max-w-none bg-white p-8 rounded-lg shadow-sm animate-fade-in [animation-delay:200ms]">
        <h2 className="text-2xl font-semibold mb-6">{content.guidelinesTitle}</h2>
        <div 
          className="text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content.guidelines }}
        />
      </div>
    </>
  );
}