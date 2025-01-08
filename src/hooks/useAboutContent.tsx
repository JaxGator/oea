import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AboutContent {
  guidelines: string;
  mission: string;
  guidelinesTitle: string;
  missionTitle: string;
}

export function useAboutContent() {
  const [content, setContent] = useState<AboutContent>({
    guidelines: `Friendly and Fun Group Guidelines

Hey there, friends!
We're all about creating a welcoming space where everyone can enjoy fun, meaningful experiences together. To keep things running smoothly, here are a few simple guidelines we'd love for you to follow:

Prioritize the Fun!
Our events are designed with you in mind, so we'd appreciate it if you could prioritize them when possible.

Stay Engaged!
Life happens, and that's okay! But if you decide to step back from events or we notice you've gone quiet for three months, we'll assume you've moved on (though we'll miss you!).

Spread the Good Vibes!
This is your happy place, and we want everyone to feel included and comfortable. Let's keep the atmosphere kind by minimizing vulgar language or suggestive humor during events.

Keep it Cool!
Disagreements happen—it's all part of being human. But if they do, let's handle them privately and respectfully. Drama-free is the way to be!

Bring in Your Besties!
Full members can suggest inviting new friends who'll vibe with our group or even help organize events. The more, the merrier!

Look the Part!
If you're voted in as a full member, the only must-do is grabbing a logo shirt to rep the group. All other swag is totally optional, but hey, who doesn't love extra merch?

Let's make every gathering a blast and keep this group a space where friendships thrive. Thanks for being part of the fun! 🎉`,
    mission: `We believe everyone deserves the chance to enjoy the great outdoors and build a meaningful connection with nature. Through our activities, we aim to break down barriers and create a welcoming space where friends can challenge themselves, boost their confidence, and grow as leaders—all while having a great time!

Our group is a close-knit circle of friends who love organizing fun adventures for ourselves and those in our extended circle. While our events aren't open to the general public or folks we don't know personally, we're always excited to share great experiences with familiar faces.`,
    guidelinesTitle: "Guidelines",
    missionTitle: "Our Mission"
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

  return {
    content
  };
}