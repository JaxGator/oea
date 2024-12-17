import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";

export const PhotoGallery = () => {
  const [isLoading] = useState(true);
  
  console.log('PhotoGallery component rendering...');

  return (
    <div className="space-y-4 border-2 border-red-500 p-4 rounded-lg">
      <h2 className="text-2xl font-bold">Photo Gallery</h2>
      
      <div className="bg-yellow-100 p-2 rounded">
        <p>Debug: PhotoGallery component is mounted</p>
        <p>Loading state: {isLoading ? 'true' : 'false'}</p>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <p>Test content to verify rendering</p>
        </CardContent>
      </Card>
    </div>
  );
}