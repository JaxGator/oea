import { Star } from "lucide-react";
import { FeaturedMerch } from "@/components/home/FeaturedMerch";

const Members = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Title Section */}
      <div className="flex items-center gap-3 border-b pb-4">
        <Star className="h-8 w-8 text-primary fill-primary" />
        <h1 className="text-3xl font-bold">Member Area</h1>
      </div>

      {/* Documentation Section */}
      <div className="prose max-w-none">
        <h2>Member Features & Documentation</h2>
        
        <section className="space-y-6">
          <div>
            <h3>Creating and Managing Events</h3>
            <p>As a member, you have the ability to create and manage events for the community:</p>
            <ul>
              <li>Click the "Create Event" button in the Events page</li>
              <li>Fill in event details including title, description, date, time, and location</li>
              <li>Upload an event image to make your event stand out</li>
              <li>Set capacity limits and enable waitlist if desired</li>
              <li>Manage RSVPs and communicate with attendees</li>
            </ul>
          </div>

          <div>
            <h3>Sharing Events</h3>
            <p>Make your events more visible to the community:</p>
            <ul>
              <li>Use the share button on any event to get a direct link</li>
              <li>Share events directly to social media platforms</li>
              <li>Invite specific members through the event page</li>
              <li>Track RSVPs and waitlist status in real-time</li>
            </ul>
          </div>

          <div>
            <h3>Additional Member Benefits</h3>
            <ul>
              <li>Access to member-only merchandise</li>
              <li>Priority registration for popular events</li>
              <li>Ability to create and host your own events</li>
              <li>Access to detailed event analytics and attendance tracking</li>
            </ul>
          </div>
        </section>
      </div>

      {/* Member Merch Section */}
      <div className="pt-8">
        <FeaturedMerch />
      </div>
    </div>
  );
};

export default Members;