import { Card, CardContent } from "@/components/ui/card";

export const PhotoGallery = () => {
  // Convert the sharing URL to an embedded format
  const googleDriveFolderUrl = "https://drive.google.com/embeddedfolder?id=1at3FHbzf32luuL07mKGFwfMBpFJOwTHc";

  return (
    <div className="space-y-4 border-2 border-blue-500 p-4 rounded-lg">
      <h2 className="text-2xl font-bold">Photo Gallery</h2>
      
      <Card>
        <CardContent className="p-4">
          <iframe 
            src={googleDriveFolderUrl}
            className="w-full min-h-[600px] border-0"
            title="Photo Gallery"
            allow="autoplay"
          />
        </CardContent>
      </Card>
    </div>
  );
};