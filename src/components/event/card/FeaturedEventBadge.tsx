import { Star } from "lucide-react";

export function FeaturedEventBadge() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-[#F97316]">Featured Event</span>
      <Star className="h-5 w-5 text-[#F97316] fill-[#F97316]" />
    </div>
  );
}