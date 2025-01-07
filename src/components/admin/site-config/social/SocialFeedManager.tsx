import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SocialFeed } from "../SocialMediaSettings";
import { AddFeedDialog } from "./AddFeedDialog";
import { FeedItem } from "./FeedItem";

interface SocialFeedManagerProps {
  feeds: SocialFeed[];
  setFeeds: (feeds: SocialFeed[]) => void;
}

export function SocialFeedManager({ feeds, setFeeds }: SocialFeedManagerProps) {
  const { toast } = useToast();

  const handleFeedAdded = (newFeed: SocialFeed) => {
    setFeeds([...feeds, newFeed]);
  };

  const handleFeedUpdate = (updatedFeed: SocialFeed) => {
    setFeeds(feeds.map(feed => 
      feed.id === updatedFeed.id ? updatedFeed : feed
    ));
  };

  const handleFeedDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('social_media_feeds')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFeeds(feeds.filter(feed => feed.id !== id));
      toast({
        title: "Success",
        description: "Feed deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting feed:', error);
      toast({
        title: "Error",
        description: "Failed to delete feed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Social Media Feeds</h3>
        <AddFeedDialog 
          feeds={feeds}
          onFeedAdded={handleFeedAdded}
        />
      </div>

      <div className="space-y-4">
        {feeds.map((feed) => (
          <FeedItem
            key={feed.id}
            feed={feed}
            onUpdate={handleFeedUpdate}
            onDelete={handleFeedDelete}
          />
        ))}
      </div>
    </div>
  );
}