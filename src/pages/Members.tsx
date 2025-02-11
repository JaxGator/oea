
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeaturedMerch } from "@/components/home/FeaturedMerch";
import { EventParticipationReport } from "@/components/admin/reports/EventParticipationReport";
import { UserActivityReport } from "@/components/admin/reports/UserActivityReport";
import { PollSection } from "@/components/members/polls/PollSection";
import { GuidesSection } from "@/components/members/guides/GuidesSection";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Members = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDonation = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: { 
          productId: 'prod_RkmuOPdZOTHCDJ',
          type: 'donation'
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Donation error:', error);
      toast.error("Failed to process donation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8 max-w-full animate-fade-in">
      {/* Title Section with Donate Button */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <Star className="h-6 w-6 sm:h-8 sm:w-8 text-[#FFD700] fill-[#FFD700] shrink-0" />
          <h1 className="text-2xl sm:text-3xl font-bold truncate">Member Area</h1>
        </div>
        <Button 
          onClick={handleDonation}
          disabled={isLoading}
          className="bg-[#0d97d1] hover:bg-[#0b86bb] text-white"
        >
          {isLoading ? "Processing..." : "Donate"}
        </Button>
      </div>

      {/* Polls Section */}
      <div className="w-full overflow-hidden">
        <PollSection />
      </div>

      {/* Reports Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-semibold">Event Participation</h2>
          <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-6 overflow-hidden">
            <EventParticipationReport />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-semibold">User Activity</h2>
          <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-6 overflow-hidden">
            <UserActivityReport />
          </div>
        </div>
      </div>

      {/* Member Merch Section */}
      <div className="overflow-hidden">
        <FeaturedMerch />
      </div>

      {/* Guides Section */}
      <div className="overflow-hidden">
        <GuidesSection />
      </div>
    </div>
  );
}

export default Members;
