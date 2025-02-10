
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { toast } from "sonner";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get URL parameters (both query and hash)
        const queryParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Check for errors in both query and hash parameters
        const queryError = queryParams.get("error");
        const hashError = hashParams.get("error");
        const error = queryError || hashError;
        
        const queryErrorDescription = queryParams.get("error_description");
        const hashErrorDescription = hashParams.get("error_description");
        const errorDescription = queryErrorDescription || hashErrorDescription;

        if (error) {
          console.error("Auth callback error:", {
            error,
            description: errorDescription,
            query: Object.fromEntries(queryParams.entries()),
            hash: Object.fromEntries(hashParams.entries())
          });

          let userMessage = "Authentication error occurred";
          
          // Handle specific error cases
          if (error === "access_denied" && queryParams.get("error_code") === "otp_expired") {
            userMessage = "The password reset link has expired. Please request a new one.";
          } else if (errorDescription) {
            userMessage = errorDescription;
          }

          setError(userMessage);
          toast.error(userMessage);
          
          // Delay redirect to show the error message
          setTimeout(() => navigate("/auth"), 3000);
          return;
        }

        // Handle password reset flow
        const type = queryParams.get("type");
        if (type === "recovery") {
          // User came from password reset email
          console.log("Password reset flow detected");
          navigate("/auth", { 
            state: { 
              mode: "reset_password",
              // Pass any additional parameters needed for the reset
              access_token: queryParams.get("access_token"),
              refresh_token: queryParams.get("refresh_token")
            }
          });
          return;
        }

        // Get the session to check if we're authenticated
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", {
            error: sessionError,
            query: Object.fromEntries(queryParams.entries()),
            hash: Object.fromEntries(hashParams.entries())
          });
          throw sessionError;
        }

        if (session) {
          toast.success("Authentication successful!");
          navigate("/");
        } else {
          // If no session and no error, something went wrong
          console.error("No session established:", {
            query: Object.fromEntries(queryParams.entries()),
            hash: Object.fromEntries(hashParams.entries())
          });
          throw new Error("No session established");
        }
      } catch (err) {
        console.error("Callback handling error:", err);
        setError("Failed to complete authentication");
        toast.error("Authentication failed. Please try again.");
        setTimeout(() => navigate("/auth"), 3000);
      }
    };

    handleCallback();
  }, [navigate, location]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return <LoadingScreen />;
};

export default AuthCallback;
