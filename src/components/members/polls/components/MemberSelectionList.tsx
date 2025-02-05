
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface Member {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface MemberSelectionListProps {
  selectedUsers: string[];
  onSelectUsers: (users: string[]) => void;
  existingShares: string[];
}

export function MemberSelectionList({ selectedUsers, onSelectUsers, existingShares }: MemberSelectionListProps) {
  const [search, setSearch] = useState("");

  const { data: members = [] } = useQuery({
    queryKey: ['members-for-sharing'],
    queryFn: async () => {
      const { data: members, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('is_approved', true)
        .or('is_member.eq.true,is_admin.eq.true')
        .order('username');

      if (error) throw error;
      return members as Member[];
    }
  });

  const filteredMembers = members.filter(member => 
    member.username.toLowerCase().includes(search.toLowerCase()) &&
    !existingShares.includes(member.id)
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-2">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center space-x-2 p-2 hover:bg-accent rounded-lg"
            >
              <Checkbox
                id={member.id}
                checked={selectedUsers.includes(member.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onSelectUsers([...selectedUsers, member.id]);
                  } else {
                    onSelectUsers(selectedUsers.filter(id => id !== member.id));
                  }
                }}
              />
              <label
                htmlFor={member.id}
                className="flex-grow cursor-pointer text-sm"
              >
                {member.username}
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
