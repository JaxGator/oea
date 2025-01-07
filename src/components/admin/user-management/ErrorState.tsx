interface ErrorStateProps {
  message?: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="p-4 text-red-500 text-center">
      <p>{message || "Error loading members. Please try refreshing the page."}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Retry
      </button>
    </div>
  );
}