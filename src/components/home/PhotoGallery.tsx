import { Card, CardContent } from "@/components/ui/card";

export const PhotoGallery = () => {
  // Convert the sharing URL to an embedded format
  const folderId = "1at3FHbzf32luuL07mKGFwfMBpFJOwTHc";
  const embedUrl = `https://drive.google.com/embeddedfolder?id=${folderId}#grid`;

  console.log('Embedding Google Drive folder with URL:', embedUrl);

  return (
    <div className="space-y-4 border-2 border-blue-500 p-4 rounded-lg">
      <h2 className="text-2xl font-bold">Photo Gallery</h2>
      
      <Card>
        <CardContent className="p-4">
          <iframe 
            src={embedUrl}
            className="w-full min-h-[600px] border-0"
            title="Photo Gallery"
            allow="autoplay"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
          />
        </CardContent>
      </Card>
    </div>
  );
};