
import { ContactAdminDialog } from "./ContactAdminDialog";

export function WelcomeMessage() {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
      <p className="text-sm text-gray-600">
        Welcome! If you previously had an account on our site, you can log in using your original email address and password="password", then change it from your profile. If you are still having trouble, click below to contact an administrator.
      </p>
      <ContactAdminDialog />
    </div>
  );
}
