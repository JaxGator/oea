import React from 'react';
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";

interface GalleryHeaderProps {
  onViewAllClick: () => void;
  totalImages: number;
  isAdmin?: boolean;
}

export const GalleryHeader: React.FC<GalleryHeaderProps> = ({ 
  onViewAllClick, 
  totalImages
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <Image className="h-6 w-6" role="presentation" />
        <h2 className="text-2xl font-bold text-gray-900">Photo Gallery</h2>
        <span className="text-sm text-gray-500">({totalImages} photos)</span>
      </div>
      <Button variant="default" onClick={onViewAllClick}>
        View All
      </Button>
    </div>
  );
};