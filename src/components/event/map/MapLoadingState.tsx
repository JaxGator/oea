
import { Loader2 } from "lucide-react";

export const MapLoadingState = () => (
  <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg mb-8 bg-gray-100 flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);
