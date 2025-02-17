import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "./ProfileForm";
import { InterestsSection } from "./InterestsSection";
import { EventsList } from "./EventsList";
import { Profile } from "@/types/auth";

interface ProfileTabsProps {
  profile: Profile | null;
  username: string;
  setUsername: (username: string) => void;
  fullName: string;
  setFullName: (fullName: string) => void;
  avatarUrl: string;
  setAvatarUrl: (avatarUrl: string) => void;
  email: string;
  setEmail: (email: string) => void;
  newPassword: string;
  setNewPassword: (password: string) => void;
  interests: string[];
  onUpdateProfile: () => Promise<void>;
  onUpdateEmail: () => Promise<void>;
  onUpdatePassword: () => Promise<void>;
  onUpdateInterests: (interests: string[]) => void;
  upcomingEvents: any[];
  pastEvents: any[];
  eventsLoading: boolean;
}

export function ProfileTabs({
  profile,
  username,
  setUsername,
  fullName,
  setFullName,
  avatarUrl,
  setAvatarUrl,
  email,
  setEmail,
  newPassword,
  setNewPassword,
  interests,
  onUpdateProfile,
  onUpdateEmail,
  onUpdatePassword,
  onUpdateInterests,
  upcomingEvents,
  pastEvents,
  eventsLoading,
}: ProfileTabsProps) {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
        <TabsTrigger value="past">Past Events</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <ProfileForm
          username={username}
          setUsername={setUsername}
          fullName={fullName}
          setFullName={setFullName}
          avatarUrl={avatarUrl}
          setAvatarUrl={setAvatarUrl}
          email={email}
          setEmail={setEmail}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          onUpdateProfile={onUpdateProfile}
          onUpdateEmail={onUpdateEmail}
          onUpdatePassword={onUpdatePassword}
        />
        {(profile?.is_approved || profile?.is_admin || profile?.is_member) && (
          <InterestsSection
            interests={interests}
            onUpdateInterests={onUpdateInterests}
          />
        )}
      </TabsContent>

      <TabsContent value="upcoming">
        <EventsList
          events={upcomingEvents}
          isLoading={eventsLoading}
          emptyMessage="No upcoming events found"
          isPastEvents={false}
        />
      </TabsContent>

      <TabsContent value="past">
        <EventsList
          events={pastEvents}
          isLoading={eventsLoading}
          emptyMessage="No past events found"
          isPastEvents={true}
        />
      </TabsContent>
    </Tabs>
  );
}
