import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function GuidesSection() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Guides</h2>
      
      <Accordion type="single" collapsible className="space-y-3">
        {/* Event Management Guide */}
        <AccordionItem value="events" className="border rounded-lg px-3 sm:px-4">
          <AccordionTrigger className="text-base sm:text-lg font-medium">
            Event Management Guide
          </AccordionTrigger>
          <AccordionContent className="pt-3 pb-2">
            <h4 className="font-semibold mb-2">Creating a New Event</h4>
            <ol className="list-decimal pl-4 sm:pl-6 space-y-2 mb-4 text-sm sm:text-base">
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

            <h4 className="font-semibold mb-2">Managing Events</h4>
            <ul className="list-disc pl-4 sm:pl-6 space-y-2 text-sm sm:text-base">
              <li>View guest list in event details</li>
              <li>Monitor waitlist if enabled</li>
              <li>Update event details as needed</li>
              <li>Send notifications to attendees</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* User Management Guide */}
        <AccordionItem value="users" className="border rounded-lg px-3 sm:px-4">
          <AccordionTrigger className="text-base sm:text-lg font-medium">
            User Management Guide
          </AccordionTrigger>
          <AccordionContent className="pt-3 pb-2">
            <h4 className="font-semibold mb-2">Managing User Roles</h4>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Admin roles control access to administrative features</li>
              <li>Member status enables event creation and management</li>
              <li>Approval status affects participation capabilities</li>
            </ul>

            <h4 className="font-semibold mb-2">User Actions</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>View user profiles and activity</li>
              <li>Modify user permissions</li>
              <li>Handle user communications</li>
              <li>Monitor user engagement</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Polls Management Guide */}
        <AccordionItem value="polls" className="border rounded-lg px-3 sm:px-4">
          <AccordionTrigger className="text-base sm:text-lg font-medium">
            Polls Management Guide
          </AccordionTrigger>
          <AccordionContent className="pt-3 pb-2">
            <h4 className="font-semibold mb-2">Creating Polls</h4>
            <ol className="list-decimal pl-6 space-y-2 mb-4">
              <li>Click "Create Poll" in the Polls section</li>
              <li>Enter poll title and description</li>
              <li>Add poll options</li>
              <li>Set poll duration</li>
              <li>Configure voting settings</li>
            </ol>

            <h4 className="font-semibold mb-2">Managing Active Polls</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Monitor voting progress</li>
              <li>View detailed results</li>
              <li>Export poll data</li>
              <li>Close or extend polls</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Reports Management Guide */}
        <AccordionItem value="reports" className="border rounded-lg px-3 sm:px-4">
          <AccordionTrigger className="text-base sm:text-lg font-medium">
            Reports Management Guide
          </AccordionTrigger>
          <AccordionContent className="pt-3 pb-2">
            <h4 className="font-semibold mb-2">Available Reports</h4>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Event Participation Reports
                <ul className="list-disc pl-6 mt-1">
                  <li>Attendance trends</li>
                  <li>RSVP analytics</li>
                  <li>Waitlist statistics</li>
                </ul>
              </li>
              <li>User Activity Reports
                <ul className="list-disc pl-6 mt-1">
                  <li>Member engagement</li>
                  <li>Login patterns</li>
                  <li>Feature usage</li>
                </ul>
              </li>
              <li>System Usage Reports
                <ul className="list-disc pl-6 mt-1">
                  <li>Performance metrics</li>
                  <li>Error tracking</li>
                  <li>Resource utilization</li>
                </ul>
              </li>
            </ul>

            <h4 className="font-semibold mb-2">Using Reports</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Filter data by date range</li>
              <li>Export reports to CSV</li>
              <li>Schedule automated reports</li>
              <li>Share reports with team members</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}