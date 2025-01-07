interface ErrorStateProps {
  message?: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="min-h-[200px] flex flex-col items-center justify-center p-4 bg-white/50 rounded-lg">
      <p className="text-red-500 mb-4">{message || "Error loading members. Please try refreshing the page."}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}