import { ResourcesHero } from "@/components/resources/ResourcesHero";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { resourcesData } from "@/data/resourcesData";

const Resources = () => {
  return (
    <div className="min-h-screen bg-background">
      <ResourcesHero />
      
      <div className="container mx-auto py-12 px-4">
        {resourcesData.map((resource, index) => (
          <ResourceCard
            key={index}
            title={resource.section}
            links={resource.items}
          />
        ))}
      </div>
    </div>
  );
};

export default Resources;