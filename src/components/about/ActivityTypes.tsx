import { 
  Bike, 
  Mountain, 
  Ship, 
  Anchor, 
  Footprints, 
  Users, 
  Fish, 
  CircleDot, 
  Waves, 
  Trophy, 
  Flag, 
  Tent 
} from "lucide-react";

interface ActivityType {
  name: string;
  icon: React.ReactNode;
}

const activities: ActivityType[] = [
  { name: "Kayaking", icon: <Ship className="h-8 w-8" /> },
  { name: "Cycling", icon: <Bike className="h-8 w-8" /> },
  { name: "Hiking", icon: <Mountain className="h-8 w-8" /> },
  { name: "Boating", icon: <Anchor className="h-8 w-8" /> },
  { name: "Running", icon: <Footprints className="h-8 w-8" /> },
  { name: "Social Events", icon: <Users className="h-8 w-8" /> },
  { name: "Fishing", icon: <Fish className="h-8 w-8" /> },
  { name: "Pickleball", icon: <CircleDot className="h-8 w-8" /> },
  { name: "Swimming", icon: <Waves className="h-8 w-8" /> },
  { name: "Sporting Events", icon: <Trophy className="h-8 w-8" /> },
  { name: "Golf", icon: <Flag className="h-8 w-8" /> },
  { name: "Camping", icon: <Tent className="h-8 w-8" /> },
];

export function ActivityTypes() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-8">
        Our Activities
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {activities.map((activity) => (
          <div
            key={activity.name}
            className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="mb-3 text-primary">{activity.icon}</div>
            <span className="text-base font-medium text-gray-700">{activity.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}