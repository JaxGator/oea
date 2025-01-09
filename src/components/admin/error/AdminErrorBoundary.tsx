import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { Shield } from "lucide-react";

interface AdminErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const AdminErrorFallback = ({ error, resetErrorBoundary }: AdminErrorFallbackProps) => (
  <div className="p-4 rounded-lg bg-red-50 text-red-800">
    <div className="flex items-center gap-2 mb-4">
      <Shield className="h-6 w-6" />
      <h2 className="text-lg font-semibold">Admin Area Error</h2>
    </div>
    <p className="mb-4">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Try Again
    </button>
  </div>
);

export function AdminErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={AdminErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}