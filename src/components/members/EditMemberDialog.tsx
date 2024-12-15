import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EditMemberDialogProps {
  member: {
    id: string;
    username: string;
    full_name: string | null;
    is_admin: boolean;
    is_approved: boolean;
    is_member: boolean;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function EditMemberDialog({ member, open, onOpenChange, onUpdate }: EditMemberDialogProps) {
  const [username, setUsername] = useState(member.username);
  const [fullName, setFullName] = useState(member.full_name || "");
  const [isAdmin, setIsAdmin] = useState(member.is_admin);
  const [isApproved, setIsApproved] = useState(member.is_approved);
  const [isMember, setIsMember] = useState(member.is_member);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          full_name: fullName,
          is_admin: isAdmin,
          is_approved: isApproved,
          is_member: isMember,
        })
        .eq('id', member.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Member has been updated",
      });
      
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating member:', error);
      toast({
        title: "Error",
        description: "Failed to update member",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAdmin"
              checked={isAdmin}
              onCheckedChange={(checked) => setIsAdmin(checked as boolean)}
            />
            <Label htmlFor="isAdmin">Admin</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isApproved"
              checked={isApproved}
              onCheckedChange={(checked) => setIsApproved(checked as boolean)}
            />
            <Label htmlFor="isApproved">Approved</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isMember"
              checked={isMember}
              onCheckedChange={(checked) => setIsMember(checked as boolean)}
            />
            <Label htmlFor="isMember">Member</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}