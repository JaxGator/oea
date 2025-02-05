
export function GalleryLoadingState() {
  return (
    <div className="space-y-4 animate-pulse p-4 sm:p-0">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-muted rounded-lg"></div>
        <div className="h-8 w-24 bg-muted rounded-lg"></div>
      </div>
      
      <div className="h-32 bg-muted rounded-lg"></div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="aspect-square bg-muted rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}
