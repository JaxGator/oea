
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

interface AuthRequiredMessageProps {
  message?: string;
  showLoginButton?: boolean;
}

export function AuthRequiredMessage({
  message = "You need to be signed in to access this feature",
  showLoginButton = true
}: AuthRequiredMessageProps) {
  const navigate = useNavigate();
  
  const handleSignIn = () => {
    navigate("/auth", { state: { returnUrl: window.location.pathname } });
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center bg-gray-50 rounded-lg border border-gray-200">
      <AlertCircle className="text-amber-500 w-10 h-10 mb-3" />
      <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      
      {showLoginButton && (
        <Button 
          variant="default" 
          onClick={handleSignIn}
        >
          Sign In
        </Button>
      )}
    </div>
  );
}
