import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { Hero } from '@/components/home/Hero';
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { FeaturedMerch } from "@/components/home/FeaturedMerch";
import { Suspense } from 'react';
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ErrorInfo } from 'react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[200px]">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

const ErrorFallback = () => (
  <div className="p-4 text-center">
    <p className="text-red-500">Something went wrong loading this section.</p>
    <button 
      onClick={() => window.location.reload()} 
      className="mt-2 text-sm text-blue-500 hover:underline"
    >
      Try refreshing the page
    </button>
  </div>
);

export default function Index() {
  return (
    <div className="bg-background">
      <ErrorBoundary fallback={<ErrorFallback />}>
        <Hero />
      </ErrorBoundary>
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <ErrorBoundary 
            fallback={<ErrorFallback />}
            onError={(error: Error, errorInfo: ErrorInfo) => {
              console.error('Featured Events Error:', error, errorInfo);
              toast.error('Failed to load events');
            }}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <FeaturedEvents />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary 
            fallback={<ErrorFallback />}
            onError={(error: Error, errorInfo: ErrorInfo) => {
              console.error('Gallery Preview Error:', error, errorInfo);
              toast.error('Failed to load gallery');
            }}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <GalleryPreview />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary 
            fallback={<ErrorFallback />}
            onError={(error: Error, errorInfo: ErrorInfo) => {
              console.error('Featured Merch Error:', error, errorInfo);
              toast.error('Failed to load merchandise');
            }}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <FeaturedMerch />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}