import { SearchInput } from "./SearchInput";
import { SearchResults } from "./SearchResults";

interface SearchContentProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  results: any[] | undefined;
  isLoading: boolean;
  onResultClick: () => void;
}

export function SearchContent({
  searchTerm,
  onSearchChange,
  results,
  isLoading,
  onResultClick,
}: SearchContentProps) {
  return (
    <div className="space-y-2">
      <SearchInput value={searchTerm} onChange={onSearchChange} />
      <SearchResults
        results={results}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onResultClick={onResultClick}
      />
    </div>
  );
}