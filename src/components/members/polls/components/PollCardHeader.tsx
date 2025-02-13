
import { Button } from "@/components/ui/button";
import { PollShareButton } from "./PollShareButton";

interface PollCardHeaderProps {
  title: string;
  description: string | null;
  totalVotes: number;
  canEdit: boolean;
  showPieChart: boolean;
  shareToken: string;
  pollId: string;
  onDelete: () => void;
  onEdit: () => void;
  onToggleChart: () => void;
}

export function PollCardHeader({
  title,
  description,
  totalVotes,
  canEdit,
  showPieChart,
  shareToken,
  pollId,
  onDelete,
  onEdit,
  onToggleChart,
}: PollCardHeaderProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <h3 className="text-lg font-semibold leading-none tracking-tight break-words">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground break-words">{description}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          <PollShareButton pollId={pollId} shareToken={shareToken} />
          {canEdit && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleChart}
                className="flex-shrink-0"
              >
                {showPieChart ? "Show Bars" : "Show Chart"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="flex-shrink-0"
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-destructive flex-shrink-0"
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
      </div>
    </div>
  );
}
