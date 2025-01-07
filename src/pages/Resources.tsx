import { SquareLibrary } from "lucide-react";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { resourcesData } from "@/data/resourcesData";

const Resources = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center gap-3 mb-8">
          <SquareLibrary className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-primary">Resources</h1>
        </div>
        
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