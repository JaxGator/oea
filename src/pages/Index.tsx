import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";

export default function Index() {
  const { isLoading, user } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#222222] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div>
            <h1 className="text-2xl font-bold">Welcome!</h1>
            {user && (
              <p className="mt-2 text-gray-600">
                You are logged in as {user.email}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}