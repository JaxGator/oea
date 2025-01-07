import { Card, CardContent } from "@/components/ui/card";
import { SocialLinksManager } from "./social/SocialLinksManager";
import { useSocialLinks } from "@/hooks/useSocialLinks";

export function SocialMediaSettings() {
  const { data: socialLinks, isLoading } = useSocialLinks();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <SocialLinksManager 
            socialLinks={socialLinks || { facebook: "", instagram: "", youtube: "" }}
            setSocialLinks={() => {}} // This will be handled inside the component
          />
        </CardContent>
      </Card>
    </div>
  );
}