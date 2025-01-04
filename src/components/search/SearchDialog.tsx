import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchContent } from "./SearchContent";

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

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="w-9 px-0">
            <Search className="h-4 w-4" role="presentation" />
            <span className="sr-only">Search</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="top" className="w-full max-w-lg mx-auto">
          <SearchContent
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            results={results}
            isLoading={isLoading}
            onResultClick={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="w-9 px-0">
          <Search className="h-4 w-4" role="presentation" />
          <span className="sr-only">Search</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] sm:w-[400px] p-2" align="end">
        <SearchContent
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          results={results}
          isLoading={isLoading}
          onResultClick={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}