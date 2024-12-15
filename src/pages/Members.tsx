import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
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

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
}

export default function Members() {
  const [members, setMembers] = useState<Profile[]>([]);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchMembers();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('username');
      
      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#222222] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Member Directory</h1>
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
        </div>
      </div>
    </div>
  );
}