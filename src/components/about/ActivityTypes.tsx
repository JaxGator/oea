import { Bike, Mountain, Sailboat, PersonStanding, Users, Fish, CircleDot, Waves, Trophy, GolfBall } from "lucide-react";
import { EditableContent } from "@/components/EditableContent";

interface ActivityType {
  name: string;
  icon: React.ReactNode;
}

const activities: ActivityType[] = [
  { name: "Kayaking", icon: <Waves className="h-8 w-8" /> },
  { name: "Cycling", icon: <Bike className="h-8 w-8" /> },
  { name: "Hiking", icon: <Mountain className="h-8 w-8" /> },
  { name: "Boating", icon: <Sailboat className="h-8 w-8" /> },
  { name: "Running", icon: <PersonStanding className="h-8 w-8" /> },
  { name: "Social Events", icon: <Users className="h-8 w-8" /> },
  { name: "Fishing", icon: <Fish className="h-8 w-8" /> },
  { name: "Pickleball", icon: <CircleDot className="h-8 w-8" /> },
  { name: "Snorkeling", icon: <Waves className="h-8 w-8" /> },
  { name: "Swimming", icon: <Waves className="h-8 w-8" /> },
  { name: "Sporting Events", icon: <Trophy className="h-8 w-8" /> },
  { name: "Golf", icon: <GolfBall className="h-8 w-8" /> },
];

export function ActivityTypes() {
  const handleTitleUpdate = (newContent: string) => {
    // The onUpdate callback will be handled by the EditableContent component
    console.log('Title updated:', newContent);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <EditableContent
        content="Our Activities"
        pageId="about"
        sectionId="activities-title"
        onUpdate={handleTitleUpdate}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        {activities.map((activity) => (
          <div
            key={activity.name}
            className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="mb-2 text-primary-500">{activity.icon}</div>
            <span className="text-sm font-medium text-gray-700">{activity.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}