
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";
import { toast } from "sonner";

interface EventShareMenuProps {
  eventId: string;
  title: string;
}

export function EventShareMenu({ eventId, title }: EventShareMenuProps) {
  const [copied, setCopied] = useState(false);
  
  const baseUrl = window.location.origin;
  const eventUrl = `${baseUrl}/events/share/${eventId}`;
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="gap-2"
      onClick={handleCopyLink}
    >
      {copied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
      {copied ? "Copied!" : "Share"}
    </Button>
  );
}
