import { CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";

interface EventCardHeaderProps {
  imageUrl: string;
  title: string;
  isFeatured?: boolean;
}

export function EventCardHeader({ imageUrl, title, isFeatured }: EventCardHeaderProps) {
  return (
    <CardHeader className="relative p-0">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      {isFeatured && (
        <div className="absolute top-0 right-0 w-40 h-40 overflow-hidden">
          <div className="absolute top-8 right-[-40px] rotate-45 bg-[#0d97d1] text-white py-1 px-12 shadow-lg flex items-center gap-1">
            <Star className="w-4 h-4" />
            <span className="text-sm font-semibold">Featured</span>
          </div>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
    </CardHeader>
  );
}