import { Star } from "lucide-react";

export function FeaturedEventBadge() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-yellow-600">Featured Event</span>
      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
    </div>
  );
}