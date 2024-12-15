import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
}

export default function Members() {
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      console.log("Fetching members...");
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('username');
      
      if (error) {
        console.error('Error fetching members:', error);
        toast({
          title: "Error",
          description: "Failed to load members. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      console.log("Fetched members data:", data);
      setMembers(data || []);
    } catch (error) {
      console.error('Error in fetchMembers:', error);
      toast({
        title: "Error",
        description: "Failed to load members. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center">
        <div className="text-white">Loading members...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#222222] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Member Directory</h1>
          {members.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No members found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profile</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar_url || ''} alt={member.username} />
                        <AvatarFallback>
                          <UserCircle className="h-10 w-10" />
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{member.username}</TableCell>
                    <TableCell>{member.full_name || '-'}</TableCell>
                    <TableCell>{member.is_admin ? 'Admin' : 'Member'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}