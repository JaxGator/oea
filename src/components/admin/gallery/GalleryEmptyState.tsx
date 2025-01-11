export function GalleryEmptyState() {
  return (
    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
      <p>No images available in the gallery.</p>
      <p className="text-sm mt-2">Upload some images to get started.</p>
    </div>
  );
}