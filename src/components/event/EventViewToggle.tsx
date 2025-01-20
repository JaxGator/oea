import { Grid, List, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

type ViewMode = "grid" | "calendar";

interface EventViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function EventViewToggle({ currentView, onViewChange }: EventViewToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={currentView === "grid" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewChange("grid")}
        className="gap-2"
      >
        <Grid className="h-4 w-4" />
        Grid
      </Button>
      <Button
        variant={currentView === "calendar" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewChange("calendar")}
        className="gap-2"
      >
        <Calendar className="h-4 w-4" />
        Calendar
      </Button>
    </div>
  );
}