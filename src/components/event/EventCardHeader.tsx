import { cn } from "@/lib/utils";

interface EventCardHeaderProps {
  imageUrl: string;
  title: string;
}

export function EventCardHeader({ imageUrl, title }: EventCardHeaderProps) {
  return (
    <div 
      className="flex flex-col space-y-1.5 relative p-0"
      role="img"
      aria-label={`Image for ${title}`}
      tabIndex={0}
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
    </div>
  );
}