import { Star } from "lucide-react";
import { FeaturedMerch } from "@/components/home/FeaturedMerch";
import { EventParticipationReport } from "@/components/admin/reports/EventParticipationReport";
import { UserActivityReport } from "@/components/admin/reports/UserActivityReport";
import { PollSection } from "@/components/members/polls/PollSection";
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

      {/* Documentation Section */}
      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold mb-6">Event Management Guide</h2>
        
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="creating" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium">
              Creating and Publishing Events
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-2">
              <h4 className="font-semibold mb-2">Creating a New Event</h4>
              <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li>Click the "Create Event" button in the Events page</li>
                <li>Fill in required event details:
                  <ul className="list-disc pl-6 mt-1">
                    <li>Title</li>
                    <li>Description (supports rich text formatting)</li>
                    <li>Date and time</li>
                    <li>Location</li>
                    <li>Maximum number of guests</li>
                    <li>Upload an event image</li>
                  </ul>
                </li>
                <li>Configure optional settings:
                  <ul className="list-disc pl-6 mt-1">
                    <li>Enable waitlist</li>
                    <li>Set waitlist capacity</li>
                    <li>Enable reminders</li>
                    <li>Set reminder intervals</li>
                  </ul>
                </li>
                <li>Click "Create Event" to save</li>
              </ol>

              <h4 className="font-semibold mb-2">Publishing Status</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>New events are published by default</li>
                <li>To unpublish: Click the event menu (three dots) and select "Unpublish"</li>
                <li>Unpublished events are only visible to admins and the creator</li>
                <li>To republish: Click "Publish" in the event menu</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="updating" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium">
              Updating Events
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-2">
              <ol className="list-decimal pl-6 space-y-2">
                <li>Open the event you want to edit</li>
                <li>Click the edit icon (pencil) or select "Edit" from the menu</li>
                <li>Update any event details</li>
                <li>Save changes</li>
              </ol>
              <p className="mt-2 text-sm text-gray-600">Note: All attendees will see the updated information</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="guests" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium">
              Managing Guests
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-2">
              <h4 className="font-semibold mb-2">Adding Guests</h4>
              <ol className="list-decimal pl-6 space-y-2">
                <li>View guest list in event details</li>
                <li>Click "Add Guests" button</li>
                <li>Enter guest names</li>
                <li>Confirm additions</li>
              </ol>
              
              <h4 className="font-semibold mt-4 mb-2">Guest Limits</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>System enforces maximum guest limit</li>
                <li>Additional guests go to waitlist if enabled</li>
                <li>Guests can be removed if needed</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="waitlist" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium">
              Waitlist Management
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-2">
              <h4 className="font-semibold mb-2">Setting Up Waitlist</h4>
              <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li>Enable waitlist when creating/editing event</li>
                <li>Set waitlist capacity (optional)</li>
              </ol>

              <h4 className="font-semibold mb-2">How It Works</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>When event reaches capacity, new RSVPs go to waitlist</li>
                <li>Waitlist operates on first-come, first-served basis</li>
                <li>When spots open up, first person on waitlist is automatically promoted</li>
                <li>Promoted attendees receive notification</li>
              </ul>

              <h4 className="font-semibold mt-4 mb-2">Managing the Waitlist</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>View current waitlist in event details</li>
                <li>Monitor waitlist size</li>
                <li>Manually promote people if needed</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="deleting" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium">
              Deleting Events
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-2">
              <h4 className="font-semibold mb-2">Steps to Delete</h4>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Open the event you want to delete</li>
                <li>Click the menu (three dots)</li>
                <li>Select "Delete Event"</li>
                <li>Confirm deletion</li>
              </ol>

              <h4 className="font-semibold mt-4 mb-2">Important Notes</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Deletion is permanent</li>
                <li>All RSVPs and waitlist entries are removed</li>
                <li>Attendees receive cancellation notification</li>
                <li>Only event creators and admins can delete events</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

export default Members;