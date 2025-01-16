import { Star } from "lucide-react";
import { FeaturedMerch } from "@/components/home/FeaturedMerch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Members = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12 animate-fade-in">
      {/* Title Section */}
      <div className="flex items-center gap-3 border-b pb-4">
        <Star className="h-8 w-8 text-primary fill-primary" />
        <h1 className="text-3xl font-bold">Member Area</h1>
      </div>

      {/* Documentation Section */}
      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold mb-6">Member Features & Documentation</h2>
        
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="events" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium">
              Creating and Managing Events
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-2">
              <p className="mb-4">As a member, you have the ability to create and manage events for the community:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Click the "Create Event" button in the Events page</li>
                <li>Fill in event details including title, description, date, time, and location</li>
                <li>Upload an event image to make your event stand out</li>
                <li>Set capacity limits and enable waitlist if desired</li>
                <li>Manage RSVPs and communicate with attendees</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sharing" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium">
              Sharing Events
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-2">
              <p className="mb-4">Make your events more visible to the community:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the share button on any event to get a direct link</li>
                <li>Share events directly to social media platforms</li>
                <li>Invite specific members through the event page</li>
                <li>Track RSVPs and waitlist status in real-time</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="benefits" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium">
              Additional Member Benefits
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-2">
              <ul className="list-disc pl-6 space-y-2">
                <li>Access to member-only merchandise</li>
                <li>Priority registration for popular events</li>
                <li>Ability to create and host your own events</li>
                <li>Access to detailed event analytics and attendance tracking</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Member Merch Section */}
      <div className="pt-8">
        <FeaturedMerch />
      </div>
    </div>
  );
};

export default Members;