import { Button } from "@/components/ui/button";
import { CalendarDays, List } from "lucide-react";

interface ViewToggleProps {
  isCalendarView: boolean;
  onViewChange: (isCalendar: boolean) => void;
}

export function ViewToggle({ isCalendarView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={isCalendarView ? "outline" : "default"}
        onClick={() => onViewChange(false)}
        className="flex gap-2"
      >
        <List className="h-4 w-4" />
        List
      </Button>
      <Button
        variant={isCalendarView ? "default" : "outline"}
        onClick={() => onViewChange(true)}
        className="flex gap-2"
      >
        <CalendarDays className="h-4 w-4" />
        Calendar
      </Button>
    </div>
  );
}