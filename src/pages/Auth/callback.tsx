
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { toast } from "sonner";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the error and token from URL if present
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const error = hashParams.get("error");
        const errorDescription = hashParams.get("error_description");

        if (error) {
          console.error("Auth callback error:", error, errorDescription);
          setError(errorDescription || "Authentication error occurred");
          toast.error(errorDescription || "Authentication error occurred");
          setTimeout(() => navigate("/auth"), 3000);
          return;
        }

        // Get the session to check if we're authenticated
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (session) {
          toast.success("Authentication successful!");
          navigate("/");
        } else {
          // If no session and no error, something went wrong
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
  }, [navigate]);

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
