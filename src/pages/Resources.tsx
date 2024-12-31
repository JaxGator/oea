import { ResourcesHero } from "@/components/resources/ResourcesHero";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { resourcesData } from "@/data/resourcesData";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

const ResourcesContent = () => {
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

const Resources = () => {
  return (
    <ErrorBoundary fallback={
      <div className="text-center p-4">
        <h2 className="text-xl font-semibold">Unable to load resources</h2>
        <p className="text-muted-foreground">Please try refreshing the page</p>
      </div>
    }>
      <ResourcesContent />
    </ErrorBoundary>
  );
};

export default Resources;