import { useState, useEffect } from "react";
import { EditableContent } from "@/components/EditableContent";
import { supabase } from "@/integrations/supabase/client";

export default function About() {
  const [content, setContent] = useState({
    guidelines: `Group Participation and Conduct

1. We want to bring fun and meaningful experiences to our friends, and to do that we need people to commit to our planned events first and above other group planned activities whenever possible - especially meetup type group events.

2. If you decide you do not wish to continue to participate in our group events or we notice a large drop-off in participation after 3 months, we will assume you no longer want to be active.

3. We want everyone to feel welcome and included - after all, you are among friends! To keep that mantra in focus, we expect everyone to refrain from excessive use of vulgar language and innuendo around others at our events.

4. We are all adults, so if there is disagreement amongst members - please handle it offline with that person directly. We have a very strict NO DRAMA policy.

5. Full Members have the ability to suggest bringing others in who would be a good fit for our group of friends, or to serve as event organizers.

6. If voted in by the group, the only financial commitment is to buy a logo shirt (all other merchandise available is optional!)`,
    mission: `We believe that everyone should have access to outdoor recreation and the opportunity to develop a connection with nature. Through our programs, we strive to remove barriers and create inclusive spaces where participants can challenge themselves, build confidence, and develop leadership skills.`
  });

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('section_id, content')
        .eq('page_id', 'about');
      
      if (error) {
        console.error('Error fetching content:', error);
        return;
      }

      if (data) {
        const newContent = { ...content };
        data.forEach(item => {
          if (item.section_id in newContent) {
            newContent[item.section_id as keyof typeof content] = item.content;
          }
        });
        setContent(newContent);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-[#F1F0FB]">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">About Us</h1>
        <div className="max-w-3xl mx-auto space-y-8">
          <EditableContent
            content={content.guidelines}
            pageId="about"
            sectionId="guidelines"
            onUpdate={(newContent) => setContent(prev => ({ ...prev, guidelines: newContent }))}
          />
          <EditableContent
            content={content.mission}
            pageId="about"
            sectionId="mission"
            onUpdate={(newContent) => setContent(prev => ({ ...prev, mission: newContent }))}
          />
        </div>
      </div>
    </div>
  );
}