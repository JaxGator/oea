import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { FeaturedEventBadge } from "./card/FeaturedEventBadge";
import { EyeOff } from "lucide-react";

interface EventCardWrapperProps {
  title: string;
  onInteraction?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  children: ReactNode;
  isFeatured?: boolean;
  isSelected?: boolean;
  isPublished?: boolean;
}

export function EventCardWrapper({
  title,
  onInteraction,
  onKeyDown,
  children,
  isFeatured = false,
  isSelected = false,
  isPublished = true
}: EventCardWrapperProps) {
  return (
    <Card
      className={`relative overflow-hidden transition-all duration-200 ${
        isSelected ? 'ring-2 ring-primary' : ''
      } ${!isPublished ? 'opacity-75' : ''} ${
        isFeatured ? 'ring-2 ring-[#f9c800]' : ''
      }`}
      onClick={onInteraction}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      aria-label={title}
    >
      {!isPublished && (
        <div className="absolute top-2 left-2 z-10 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md flex items-center gap-2">
          <EyeOff className="h-4 w-4" />
          <span className="text-sm font-medium">Unpublished</span>
        </div>
      )}
      
      {children}
    </Card>
  );
}