
import { Star } from "lucide-react";
import { FeaturedMerch } from "@/components/home/FeaturedMerch";
import { EventParticipationReport } from "@/components/admin/reports/EventParticipationReport";
import { UserActivityReport } from "@/components/admin/reports/UserActivityReport";
import { PollSection } from "@/components/members/polls/PollSection";
import { GuidesSection } from "@/components/members/guides/GuidesSection";

const Members = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-8 max-w-full animate-fade-in">
      {/* Title Section */}
      <div className="flex items-center border-b pb-3">
        <div className="flex items-center gap-2">
          <Star className="h-6 w-6 sm:h-8 sm:w-8 text-[#FFD700] fill-[#FFD700] shrink-0" />
          <h1 className="text-2xl sm:text-3xl font-bold truncate">Member Area</h1>
        </div>
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
