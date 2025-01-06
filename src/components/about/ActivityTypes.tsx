import { Anchor, Tent } from "lucide-react";

interface ActivityType {
  name: string;
  icon: React.ReactNode;
}

const activities: ActivityType[] = [
  { name: "Boating", icon: <Anchor size={32} /> },
  { name: "Camping", icon: <Tent size={32} /> }
];

export function ActivityTypes() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-8 text-gray-900">
        Our Activities
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8">
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