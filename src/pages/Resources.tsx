import { SquareLibrary } from "lucide-react";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { resourcesData } from "@/data/resourcesData";

const Resources = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-12">
          <SquareLibrary className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">Resources</h1>
        </div>
        
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