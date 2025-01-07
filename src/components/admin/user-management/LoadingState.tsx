import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="min-h-[200px] flex items-center justify-center p-4 bg-white/50 rounded-lg">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading users...</span>
      </div>
    </div>
  );
}