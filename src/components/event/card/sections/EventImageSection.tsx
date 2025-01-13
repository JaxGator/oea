import { cn } from "@/lib/utils";

interface EventImageSectionProps {
  imageUrl: string;
  title: string;
}

export function EventImageSection({ imageUrl, title }: EventImageSectionProps) {
  return (
    <div className="aspect-video relative rounded-t-lg overflow-hidden">
      <img
        src={imageUrl}
        alt={title}
        className={cn(
          "w-full h-full object-cover",
          "transition-transform duration-200 hover:scale-105"
        )}
      />
    </div>
  );
}