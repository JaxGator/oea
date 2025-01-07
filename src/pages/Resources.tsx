import { SquareLibrary } from "lucide-react";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { resourcesData } from "@/data/resourcesData";

const Resources = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center gap-3 mb-8">
          <SquareLibrary className="h-6 w-6" />
          <h2 className="text-2xl font-semibold">Resources</h2>
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