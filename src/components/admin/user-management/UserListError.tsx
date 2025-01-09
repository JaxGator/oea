import { Button } from "@/components/ui/button";

interface UserListErrorProps {
  onRetry: () => void;
}

export function UserListError({ onRetry }: UserListErrorProps) {
  return (
    <div className="p-6 bg-destructive/10 rounded-lg border border-destructive/20">
      <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Users</h3>
      <p className="text-destructive/80 mb-4">There was a problem loading the user list.</p>
      <Button 
        onClick={onRetry}
        variant="outline"
      >
        Try Again
      </Button>
    </div>
  );
}