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
  { name: "Kayaking", icon: <Ship size={32} /> },
  { name: "Cycling", icon: <Bike size={32} /> },
  { name: "Hiking", icon: <Mountain size={32} /> },
  { name: "Boating", icon: <Anchor size={32} /> },
  { name: "Running", icon: <Footprints size={32} /> },
  { name: "Social Events", icon: <Users size={32} /> },
  { name: "Fishing", icon: <Fish size={32} /> },
  { name: "Pickleball", icon: <CircleDot size={32} /> },
  { name: "Swimming", icon: <Waves size={32} /> },
  { name: "Sporting Events", icon: <Trophy size={32} /> },
  { name: "Golf", icon: <Flag size={32} /> },
  { name: "Camping", icon: <Tent size={32} /> }
];

export function ActivityTypes() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-8 text-gray-900">
        Our Activities
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {activities.map((activity) => (
          <div
            key={activity.name}
            className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="mb-3 text-primary">
              {activity.icon}
            </div>
            <span className="text-base font-medium text-gray-700">
              {activity.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}