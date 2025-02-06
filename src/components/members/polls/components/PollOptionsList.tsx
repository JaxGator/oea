
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { PollOption } from "./PollOption";
import { PollVoterList } from "../PollVoterList";
import { useIsMobile } from "@/hooks/use-mobile";

interface PollOptionsListProps {
  options: Array<{
    id: string;
    option_text: string;
  }>;
  userVote: string | undefined;
  isVoting: boolean;
  isPublicView: boolean;
  voters: Array<{
    id: string;
    option_id: string;
    user_id: string;
    profiles: {
      username: string;
      avatar_url: string | null;
    } | null;
  }>;
  onVote: (optionId: string) => void;
}

export function PollOptionsList({
  options,
  userVote,
  isVoting,
  isPublicView,
  voters,
  onVote,
}: PollOptionsListProps) {
  const isMobile = useIsMobile();

  const getVotersForOption = (optionId: string) => {
    return voters.filter(vote => vote.option_id === optionId);
  };

  const getVotePercentage = (optionId: string) => {
    if (voters.length === 0) return 0;
    const optionVotes = getVotersForOption(optionId).length;
    return (optionVotes / voters.length) * 100;
  };

  return (
    <div className="space-y-4">
      {options.map((option) => {
        const percentage = getVotePercentage(option.id);
        const isSelected = userVote === option.id;
        const optionVoters = getVotersForOption(option.id);
        const isDisabled = isPublicView || !!userVote || isVoting;

        return (
          <div key={option.id}>
            {isMobile ? (
              <Sheet>
                <SheetTrigger asChild>
                  <div>
                    <PollOption
                      optionText={option.option_text}
                      isSelected={isSelected}
                      percentage={percentage}
                      votesCount={optionVoters.length}
                      disabled={isDisabled}
                      onVote={() => onVote(option.id)}
                      showLockIcon={isPublicView}
                    />
                  </div>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[40vh]">
                  <SheetHeader>
                    <SheetTitle>Voters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <PollVoterList voters={optionVoters} />
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div>
                    <PollOption
                      optionText={option.option_text}
                      isSelected={isSelected}
                      percentage={percentage}
                      votesCount={optionVoters.length}
                      disabled={isDisabled}
                      onVote={() => onVote(option.id)}
                      showLockIcon={isPublicView}
                    />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent align="end" className="w-64">
                  <PollVoterList voters={optionVoters} />
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        );
      })}
    </div>
  );
}
