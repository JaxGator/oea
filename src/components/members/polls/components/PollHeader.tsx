import { Button } from "@/components/ui/button";
import { Edit, Trash, BarChart, PieChart, Users } from "lucide-react";

interface PollHeaderProps {
  title: string;
  description: string | null;
  totalVotes: number;
  canEdit: boolean;
  showPieChart: boolean;
  onDelete: () => void;
  onToggleChart: () => void;
}

export function PollHeader({
  title,
  description,
  totalVotes,
  canEdit,
  showPieChart,
  onDelete,
  onToggleChart
}: PollHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {canEdit && (
          <>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash className="h-4 w-4" />
            </Button>
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleChart}
        >
          {showPieChart ? <BarChart className="h-4 w-4" /> : <PieChart className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon">
          <Users className="h-4 w-4" />
          <span className="ml-1">{totalVotes}</span>
        </Button>
      </div>
    </div>
  );
}