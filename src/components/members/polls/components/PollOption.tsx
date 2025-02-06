
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Lock } from "lucide-react";

interface PollOptionProps {
  optionText: string;
  isSelected: boolean;
  percentage: number;
  votesCount: number;
  disabled: boolean;
  onVote: () => void;
  showLockIcon?: boolean;
}

export function PollOption({
  optionText,
  isSelected,
  percentage,
  votesCount,
  disabled,
  onVote,
  showLockIcon = false
}: PollOptionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Button
          variant={isSelected ? "default" : "outline"}
          className="w-full justify-start gap-2 min-h-[2.5rem] break-words whitespace-normal text-left"
          disabled={disabled}
          onClick={onVote}
        >
          {isSelected && <Check className="h-4 w-4 flex-shrink-0" />}
          {showLockIcon && <Lock className="h-4 w-4 flex-shrink-0" />}
          <span className="line-clamp-2">{optionText}</span>
        </Button>
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="flex justify-between text-sm text-muted-foreground px-1">
        <span>{votesCount} {votesCount === 1 ? "vote" : "votes"}</span>
        <span>{percentage.toFixed(1)}%</span>
      </div>
    </div>
  );
}
