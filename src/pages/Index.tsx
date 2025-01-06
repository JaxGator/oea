import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { Hero } from '@/components/home/Hero';
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { FeaturedMerch } from "@/components/home/FeaturedMerch";
import { Suspense } from 'react';
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[200px]">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

export default function Index() {
  return (
    <div className="bg-background">
      <ErrorBoundary>
        <Hero />
      </ErrorBoundary>
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <FeaturedEvents />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <GalleryPreview />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <FeaturedMerch />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}