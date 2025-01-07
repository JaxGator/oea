import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className="h-6 w-6 animate-spin mr-2" />
      <span>Loading users...</span>
    </div>
  );
}