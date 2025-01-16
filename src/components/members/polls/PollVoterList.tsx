import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PollVoter {
  id: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
}

interface PollVoterListProps {
  voters: PollVoter[];
}

export function PollVoterList({ voters }: PollVoterListProps) {
  const getInitials = (username: string) => username.charAt(0).toUpperCase();

  return (
    <div className="space-y-2">
      {voters.map((vote) => (
        <div key={vote.id} className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={vote.profiles?.avatar_url || undefined} />
            <AvatarFallback>
              {vote.profiles ? getInitials(vote.profiles.username) : '?'}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{vote.profiles?.username || 'Unknown User'}</span>
        </div>
      ))}
    </div>
  );
}