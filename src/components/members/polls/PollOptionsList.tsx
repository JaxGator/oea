import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { PollVoterList } from "./PollVoterList";

interface PollOption {
  id: string;
  option_text: string;
}

interface PollVote {
  id: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
}

interface PollOptionsListProps {
  options: PollOption[];
  getVotersForOption: (optionId: string) => PollVote[];
}

export function PollOptionsList({ options, getVotersForOption }: PollOptionsListProps) {
  return (
    <div className="space-y-2">
      {options.map((option) => {
        const voters = getVotersForOption(option.id);
        return (
          <div key={option.id} className="flex items-center justify-between">
            <span>{option.option_text}</span>
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="text-sm text-muted-foreground cursor-help">
                  {voters.length} votes
                </span>
              </HoverCardTrigger>
              <HoverCardContent align="end" className="w-64">
                <PollVoterList voters={voters} />
              </HoverCardContent>
            </HoverCard>
          </div>
        );
      })}
    </div>
  );
}