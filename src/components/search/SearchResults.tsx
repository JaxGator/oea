import { useNavigate } from "react-router-dom";

type SearchResult = {
  type: string;
  id: string;
  title: string;
  description: string | null;
  url: string;
  created_at: string;
};

interface SearchResultsProps {
  results: SearchResult[] | undefined;
  isLoading: boolean;
  searchTerm: string;
  onResultClick: () => void;
}

export function SearchResults({ results, isLoading, searchTerm, onResultClick }: SearchResultsProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="text-sm p-2">Loading...</div>;
  }

  if (results?.length === 0 && searchTerm.length > 2) {
    return (
      <div className="text-sm text-muted-foreground p-2">
        No results found
      </div>
    );
  }

  return (
    <div className="max-h-[300px] overflow-y-auto space-y-1">
      {results?.map((result) => (
        <button
          key={result.id}
          className="w-full text-left p-2 hover:bg-accent rounded-md transition-colors cursor-pointer active:bg-accent/80"
          onClick={() => {
            onResultClick();
            navigate(result.url);
          }}
          type="button"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{result.title}</span>
            <span className="text-xs text-muted-foreground capitalize">
              {result.type}
            </span>
          </div>
          {result.description && (
            <span className="text-sm text-muted-foreground line-clamp-1">
              {result.description}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}