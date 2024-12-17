import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#222222] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div>
            <h1 className="text-2xl font-bold">Welcome!</h1>
            <p className="mt-2 text-gray-600">
              Welcome to our event platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}