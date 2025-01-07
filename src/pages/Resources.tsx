import { SquareLibrary, ChevronRight } from "lucide-react";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { resourcesData } from "@/data/resourcesData";

const Resources = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center gap-3 mb-8">
          <SquareLibrary className="h-6 w-6" />
          <h1 className="text-2xl font-semibold">Resources</h1>
        </div>
        
        {resourcesData.map((resource, index) => (
          <div key={index} className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <ChevronRight className="h-5 w-5" />
              <h2 className="text-2xl font-bold text-black">{resource.section}</h2>
            </div>
            <ResourceCard
              title={resource.section}
              links={resource.items}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;