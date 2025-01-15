import { Star } from "lucide-react";

export function FeaturedEventBadge() {
  return (
    <div className="bg-[#fff8e6] px-2 py-1 rounded-md flex items-center gap-1">
      <Star className="h-3 w-3 text-[#f9c800] fill-[#f9c800]" />
      <span className="text-xs font-medium text-[#f9c800]">Featured</span>
    </div>
  );
}