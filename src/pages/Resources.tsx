import { SquareLibrary } from "lucide-react";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { resourcesData } from "@/data/resourcesData";

const Resources = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
          <SquareLibrary className="h-6 w-6" />
          Resources
        </h2>
        
        <div className="space-y-12">
          {resourcesData.map((resource, index) => (
            <ResourceCard
              key={index}
              title={resource.section}
              links={resource.items}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;