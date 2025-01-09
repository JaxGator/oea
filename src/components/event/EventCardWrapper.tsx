import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EventCardWrapperProps {
  children: React.ReactNode;
  title: string;
  onInteraction?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  isFeatured?: boolean;
}

export function EventCardWrapper({
  children,
  title,
  onInteraction,
  onKeyDown,
  isFeatured = false
}: EventCardWrapperProps) {
  return (
    <Card
      onClick={onInteraction}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${title}`}
      className={cn(
        "relative overflow-hidden transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer",
        isFeatured && "border-2 border-primary"
      )}
    >
      {children}
    </Card>
  );
}