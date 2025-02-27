
import { toast } from "sonner";
import { PostgrestError, AuthError } from "@supabase/supabase-js";

export function handleDatabaseError(error: PostgrestError | null, defaultMessage = "An error occurred"): void {
  if (!error) return;

  console.error("Database error:", {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint
  });

  // Handle specific error codes
  if (error.code === "23505") {
    toast.error("This record already exists");
    return;
  }

  if (error.code === "42501") {
    toast.error("You don't have permission to perform this action");
    return;
  }

  // Generic error handler
  toast.error(error.message || defaultMessage);
}

export function handleAuthError(error: AuthError | null, defaultMessage = "Authentication error"): void {
  if (!error) return;

  console.error("Auth error:", {
    name: error.name,
    message: error.message,
    status: error.status
  });

  // Special handling for common auth errors
  if (error.message.includes("Email not confirmed")) {
    toast.error("Please confirm your email address before signing in");
    return;
  }

  if (error.message.includes("Invalid login credentials")) {
    toast.error("Invalid email or password");
    return;
  }

  // Generic auth error handler
  toast.error(error.message || defaultMessage);
}
