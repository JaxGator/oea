
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ShareUrlDisplayProps {
  shareUrl: string;
  onCopy: () => void;
}

export function ShareUrlDisplay({ shareUrl, onCopy }: ShareUrlDisplayProps) {
  if (!shareUrl) return null;

  return (
    <Alert>
      <AlertDescription className="break-all text-sm">
        {shareUrl}
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-2"
          onClick={onCopy}
        >
          Copy
        </Button>
      </AlertDescription>
    </Alert>
  );
}
