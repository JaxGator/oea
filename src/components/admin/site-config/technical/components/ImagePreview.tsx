import { ImageType } from "../utils/imageUpload";

interface ImagePreviewProps {
  imageUrl: string;
  label: string;
  imageType: ImageType;
}

export function ImagePreview({ imageUrl, label, imageType }: ImagePreviewProps) {
  return (
    <div className={`relative ${imageType === 'favicon' ? 'w-16 h-16' : 'w-40 h-40'} border rounded-lg overflow-hidden`}>
      <img 
        src={imageUrl} 
        alt={label} 
        className="w-full h-full object-contain"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.src = '/placeholder.svg';
        }}
      />
    </div>
  );
}