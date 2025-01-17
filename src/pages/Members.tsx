import { Star } from "lucide-react";
import { FeaturedMerch } from "@/components/home/FeaturedMerch";
import { EventParticipationReport } from "@/components/admin/reports/EventParticipationReport";
import { UserActivityReport } from "@/components/admin/reports/UserActivityReport";
import { PollSection } from "@/components/members/polls/PollSection";
import { GuidesSection } from "@/components/members/guides/GuidesSection";

const Members = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12 animate-fade-in">
      {/* Title Section */}
      <div className="flex items-center gap-3 border-b pb-4">
        <Star className="h-8 w-8 text-[#FFD700] fill-[#FFD700]" />
        <h1 className="text-3xl font-bold">Member Area</h1>
      </div>

      {/* Polls Section */}
      <PollSection />

      {/* Reports Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Event Participation Report */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Event Participation</h2>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <EventParticipationReport />
          </div>
        </div>

        {/* User Activity Report */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">User Activity</h2>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <UserActivityReport />
          </div>
        </div>
      </div>

      {/* Member Merch Section */}
      <div>
        <FeaturedMerch />
      </div>

      {/* Guides Section */}
      <GuidesSection />
    </div>
  );
}

export default Members;