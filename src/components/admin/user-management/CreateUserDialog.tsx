import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { MemberFormFields } from "@/components/members/MemberFormFields";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CreateUserDialogProps {
  onUserCreated: () => void;
}

export function CreateUserDialog({ onUserCreated }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const handleCreateUser = async () => {
    try {
      const { error } = await supabase.functions.invoke('admin-create-user', {
        body: {
          email,
          password,
          username,
          fullName,
          isAdmin,
          isApproved,
          isMember,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User created successfully",
      });

      setOpen(false);
      onUserCreated();
      
      // Reset form
      setUsername("");
      setFullName("");
      setEmail("");
      setPassword("");
      setIsAdmin(false);
      setIsApproved(false);
      setIsMember(false);
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <MemberFormFields
          username={username}
          setUsername={setUsername}
          fullName={fullName}
          setFullName={setFullName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
          isApproved={isApproved}
          setIsApproved={setIsApproved}
          isMember={isMember}
          setIsMember={setIsMember}
          onSubmit={handleCreateUser}
        />
      </DialogContent>
    </Dialog>
  );
}