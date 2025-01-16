import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";

interface PollOptionProps {
  optionText: string;
  isSelected: boolean;
  percentage: number;
  votesCount: number;
  disabled: boolean;
  onVote: () => void;
}

export function PollOption({
  optionText,
  isSelected,
  percentage,
  votesCount,
  disabled,
  onVote
}: PollOptionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Button
          variant={isSelected ? "default" : "outline"}
          className="w-full justify-start gap-2"
          disabled={disabled}
          onClick={onVote}
        >
          {isSelected && <Check className="h-4 w-4" />}
          {optionText}
        </Button>
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{votesCount} votes</span>
        <span>{percentage.toFixed(1)}%</span>
      </div>
    </div>
  );
}