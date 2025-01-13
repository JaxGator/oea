import { Star } from "lucide-react";

export function FeaturedEventBadge() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-[#f9c800]">Featured Event</span>
      <Star className="h-5 w-5 text-[#f9c800] fill-[#f9c800]" />
    </div>
  );
}