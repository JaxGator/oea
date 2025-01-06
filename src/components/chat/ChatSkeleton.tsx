import { Skeleton } from "@/components/ui/skeleton";

export function ChatSkeleton() {
  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <div className="flex justify-start">
        <Skeleton className="h-12 w-[60%] rounded-lg" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-12 w-[40%] rounded-lg" />
      </div>
      <div className="flex justify-start">
        <Skeleton className="h-12 w-[50%] rounded-lg" />
      </div>
    </div>
  );
}