
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePollSharing } from "@/hooks/polls/usePollSharing";
import { MemberSelectionList } from "./MemberSelectionList";
import { ShareUrlDisplay } from "./ShareUrlDisplay";

interface SharePollDialogProps {
  pollId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SharePollDialog({ pollId, open, onOpenChange }: SharePollDialogProps) {
  const {
    shareUrl,
    selectedUsers,
    setSelectedUsers,
    existingShares,
    handleShare,
    copyShareUrl
  } = usePollSharing(pollId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Poll</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <ShareUrlDisplay shareUrl={shareUrl} onCopy={copyShareUrl} />

          <MemberSelectionList
            selectedUsers={selectedUsers}
            onSelectUsers={setSelectedUsers}
            existingShares={existingShares}
          />

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleShare}
              disabled={selectedUsers.length === 0}
            >
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
