
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { toast } from "sonner";

interface EventShareMenuProps {
  eventId: string;
  shareToken: string;
}

export function EventShareMenu({ eventId, shareToken }: EventShareMenuProps) {
  const handleShare = async () => {
    const baseUrl = window.location.origin;
    const eventUrl = `${baseUrl}/events/share/${shareToken}`;
    
    try {
      await navigator.clipboard.writeText(eventUrl);
      toast.success("Link copied to clipboard");
    } catch (err) {
      console.error('Error copying link:', err);
      toast.error("Failed to copy link");
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="gap-2"
      onClick={handleShare}
    >
      <Share className="h-4 w-4" />
      Share
    </Button>
  );
}
