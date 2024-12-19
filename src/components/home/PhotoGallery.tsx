import { Card, CardContent } from "@/components/ui/card";

export const PhotoGallery = () => {
  // Replace this URL with your actual Google Drive folder's sharing URL
  const googleDriveFolderUrl = "https://drive.google.com/embeddedfolder?id=YOUR_FOLDER_ID";

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