import { Bike, Mountain, Sailboat, Footprints, Users, Fish, CircleDot, Waves, Trophy, Flag } from "lucide-react";
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
  { name: "Running", icon: <Footprints className="h-8 w-8" /> },
  { name: "Social Events", icon: <Users className="h-8 w-8" /> },
  { name: "Fishing", icon: <Fish className="h-8 w-8" /> },
  { name: "Pickleball", icon: <CircleDot className="h-8 w-8" /> },
  { name: "Snorkeling", icon: <Waves className="h-8 w-8" /> },
  { name: "Swimming", icon: <Waves className="h-8 w-8" /> },
  { name: "Sporting Events", icon: <Trophy className="h-8 w-8" /> },
  { name: "Golf", icon: <Flag className="h-8 w-8" /> },
];

export function ActivityTypes() {
  const handleTitleUpdate = async (newContent: string) => {
    try {
      const { error } = await supabase
        .from('page_content')
        .upsert({
          page_id: 'about',
          section_id: 'activities-title',
          content: newContent,
        }, {
          onConflict: 'page_id,section_id'
        });

      if (error) {
        console.error('Error updating content:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <div className="text-2xl font-semibold mb-4">
        <EditableContent
          content="Our Activities"
          pageId="about"
          sectionId="activities-title"
          onUpdate={handleTitleUpdate}
        />
      </div>
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