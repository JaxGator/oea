import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, RefreshCcw } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

export const ErrorBoundary = ({ children, fallback }: ErrorBoundaryProps) => {
  const error = useRouteError();
  const navigate = useNavigate();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Script error caught:", event);
      toast({
        title: "An error occurred",
        description: "We're working to fix this issue. Please try refreshing the page.",
        variant: "destructive",
      });
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold">
            {error.status === 404 ? "Page Not Found" : "Oops! Something went wrong"}
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            {error.status === 404
              ? "The page you're looking for doesn't exist or has been moved."
              : "We encountered an unexpected error. Please try again later."}
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Go Back
            </Button>
            <Button
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  try {
    return <>{children}</>;
  } catch (err) {
    console.error("Error in ErrorBoundary:", err);
    return <>{fallback}</>;
  }
};