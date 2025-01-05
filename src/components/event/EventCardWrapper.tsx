import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface EventCardWrapperProps {
  title: string;
  onInteraction: (e: React.KeyboardEvent | React.MouseEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  children: ReactNode;
}

export function EventCardWrapper({ 
  title, 
  onInteraction, 
  onKeyDown, 
  children 
}: EventCardWrapperProps) {
  return (
    <Card 
      className="w-full transition-all duration-300 hover:shadow-lg animate-fade-in bg-white cursor-pointer"
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