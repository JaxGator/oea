
import React, { useEffect } from 'react';
import { HomeLayout } from '@/components/home/HomeLayout';
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { SocialFeed } from "@/components/home/SocialFeed";
import { LeaderboardSection } from '@/components/home/LeaderboardSection';
import { TacoTracker } from "@/components/home/TacoTracker";
import { toast } from 'sonner';

export default function Index() {
  useEffect(() => {
    console.log('Index page mounted');
    
    // Simple check to confirm the page is loading
    toast.success("Welcome to the application!");
    
    return () => console.log('Index page unmounted');
  }, []);

  return (
    <HomeLayout>
      <div className="space-y-8">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Featured Events</h2>
          <FeaturedEvents />
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
          <LeaderboardSection />
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Gallery</h2>
          <GalleryPreview />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Taco Tracker</h2>
            <TacoTracker />
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Social Feed</h2>
            <SocialFeed />
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
