import { cn } from "@/lib/utils";

interface EventCardHeaderProps {
  imageUrl: string;
  title: string;
}

export function EventCardHeader({ imageUrl, title }: EventCardHeaderProps) {
  const fallbackImageUrl = "/placeholder.svg";

  return (
    <div className="flex flex-col space-y-1.5 relative p-0">
      <figure className="w-full h-48">
        <img
          src={imageUrl || fallbackImageUrl}
          alt={`Event image for ${title}`}
          className="w-full h-full object-cover rounded-t-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackImageUrl;
          }}
        />
      </figure>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
    </div>
  );
}