import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

type SearchResult = {
  type: string;
  id: string;
  title: string;
  description: string | null;
  url: string;
  created_at: string;
};

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data: results, isLoading } = useQuery({
    queryKey: ["search", searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];
      const { data, error } = await supabase.rpc('search_site', {
        search_term: searchTerm
      });
      if (error) throw error;
      return (data as SearchResult[]).map(result => ({
        ...result,
        description: result.description ? result.description.replace(/<[^>]*>/g, '') : null
      }));
    },
    enabled: searchTerm.length > 2
  });

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setSearchTerm("");
    navigate(result.url);
  };

  const SearchContent = () => (
    <div className="space-y-2">
      <Input
        placeholder="Search events and pages..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
        autoFocus
      />
      <div className="max-h-[300px] overflow-y-auto space-y-1">
        {isLoading && <div className="text-sm p-2">Loading...</div>}
        {results?.map((result) => (
          <button
            key={result.id}
            className="w-full text-left p-2 hover:bg-accent rounded-md transition-colors cursor-pointer active:bg-accent/80"
            onClick={() => handleSelect(result)}
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
        {results?.length === 0 && searchTerm.length > 2 && (
          <div className="text-sm text-muted-foreground p-2">
            No results found
          </div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="w-9 px-0">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="top" className="w-full max-w-lg mx-auto">
          <SearchContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="w-9 px-0">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] sm:w-[400px] p-2" align="end">
        <SearchContent />
      </PopoverContent>
    </Popover>
  );
}