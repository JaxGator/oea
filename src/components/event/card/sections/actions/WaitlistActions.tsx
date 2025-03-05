
import { Button } from "@/components/ui/button";
import { Users, X } from "lucide-react";
import { LoadingButton } from "@/components/ui/loading-button";

interface WaitlistActionsProps {
  isSubmitting: boolean;
  onCancelRSVP: () => void;
}

export function WaitlistActions({
  isSubmitting,
  onCancelRSVP
}: WaitlistActionsProps) {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        className="flex items-center gap-2 bg-yellow-50 text-yellow-600 border-yellow-200"
        disabled
      >
        <Users className="h-4 w-4" />
        On Waitlist
      </Button>
      
      <LoadingButton 
        variant="outline" 
        onClick={onCancelRSVP}
        isLoading={isSubmitting}
        className="flex items-center gap-2 text-red-500 hover:bg-red-50"
      >
        <X className="h-4 w-4" />
        Leave Waitlist
      </LoadingButton>
    </div>
  );
}
