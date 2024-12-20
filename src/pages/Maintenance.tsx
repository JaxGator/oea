import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Wrench } from "lucide-react";

export default function Maintenance() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <Wrench className="h-16 w-16 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Under Maintenance</h1>
        <p className="text-gray-600 max-w-md">
          We're currently performing some maintenance on our site. We'll be back shortly.
        </p>
        <Button
          onClick={() => navigate("/", { replace: true })}
          variant="outline"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}