
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SharePollDialog } from "./SharePollDialog";
import { useState } from "react";

interface PollShareButtonProps {
  pollId: string;
  className?: string;
}

export function PollShareButton({ pollId, className }: PollShareButtonProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={className}
        onClick={() => setShowShareDialog(true)}
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>

      <SharePollDialog
        pollId={pollId}
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      />
    </>
  );
}
