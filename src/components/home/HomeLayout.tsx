import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { Suspense } from 'react';
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ErrorInfo } from 'react';

interface SectionProps {
  children: React.ReactNode;
  title: string;
}

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[200px]">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

const SectionErrorFallback = ({ title }: { title: string }) => (
  <div className="p-4 text-center">
    <p className="text-red-500">Failed to load {title}</p>
    <button 
      onClick={() => window.location.reload()} 
      className="mt-2 text-sm text-blue-500 hover:underline"
    >
      Try refreshing the page
    </button>
  </div>
);

const Section = ({ children, title }: SectionProps) => (
  <ErrorBoundary 
    fallback={<SectionErrorFallback title={title} />}
    onError={(error: Error, errorInfo: ErrorInfo) => {
      console.error(`${title} Error:`, error, errorInfo);
      toast.error(`Failed to load ${title.toLowerCase()}`);
    }}
  >
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

export const HomeLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background">
    {children}
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {children}
      </div>
    </div>
  </div>
);

export const HomeSection = Section;