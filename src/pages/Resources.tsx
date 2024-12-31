import { ResourcesHero } from "@/components/resources/ResourcesHero";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { resourcesData } from "@/data/resourcesData";
import { EditableContent } from "@/components/EditableContent";

const Resources = () => {
  return (
    <div className="min-h-screen bg-background">
      <ResourcesHero />
      
      <div className="container mx-auto py-12 px-4">
        {resourcesData.map((resource, index) => (
          <EditableContent
            key={index}
            content={resource.section}
            pageId="resources"
            sectionId={`section-${index}`}
            onUpdate={(newContent) => {
              // This will be implemented in the next phase with state management
              console.log('Content updated:', newContent);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Resources;