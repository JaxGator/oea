import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
    toast({
      title: "Cookies accepted",
      description: "Thank you for accepting our cookie policy",
    });
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowBanner(false);
    toast({
      title: "Cookies declined",
      description: "You have declined our cookie policy",
    });
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          <p>
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.{" "}
            <a href="/privacy" className="underline hover:text-primary">
              Learn more
            </a>
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-500"
            onClick={declineCookies}
          >
            Decline
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={acceptCookies}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}