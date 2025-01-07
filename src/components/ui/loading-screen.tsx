import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center" 
      role="status" 
      aria-label="Loading"
    >
      <Loader2 
        className="h-8 w-8 animate-spin text-primary" 
        aria-hidden="true" 
      />
      <span className="sr-only">{message}</span>
    </div>
  );
}