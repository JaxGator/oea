import { Card } from "@/components/ui/card";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EventCardWrapperProps {
  title: string;
  onInteraction: (e: React.KeyboardEvent | React.MouseEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  children: ReactNode;
  isFeatured?: boolean;
}

export function EventCardWrapper({ 
  title, 
  onInteraction, 
  onKeyDown, 
  children,
  isFeatured = false
}: EventCardWrapperProps) {
  return (
    <Card 
      className={cn(
        "w-full transition-all duration-300 hover:shadow-lg animate-fade-in bg-white cursor-pointer",
        isFeatured && "ring-2 ring-yellow-400 shadow-md hover:ring-yellow-500"
      )}
      onClick={onInteraction}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${title}`}
    >
      {children}
    </Card>
  );
}