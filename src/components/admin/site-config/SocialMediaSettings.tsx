import { Card, CardContent } from "@/components/ui/card";
import { SocialLinksManager } from "./social/SocialLinksManager";

export function SocialMediaSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <SocialLinksManager />
        </CardContent>
      </Card>
    </div>
  );
}