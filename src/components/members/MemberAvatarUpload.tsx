import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MemberAvatarUploadProps {
  memberId: string;
  username: string;
  avatarUrl: string;
  onAvatarUpdate: (url: string) => void;
}

export function MemberAvatarUpload({ 
  memberId, 
  username, 
  avatarUrl, 
  onAvatarUpdate 
}: MemberAvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      setUploading(true);

      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const filePath = `avatars/${memberId}/${timestamp}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: true // Allow overwriting existing avatar
        });

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Update the profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', memberId);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw updateError;
      }

      onAvatarUpdate(publicUrl);

      toast({
        title: "Success",
        description: "Avatar uploaded successfully",
      });
    } catch (error) {
      console.error('Error in avatar upload:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload avatar",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl} alt={username} />
        <AvatarFallback>
          <UserCircle className="h-24 w-24" />
        </AvatarFallback>
      </Avatar>
      <div className="space-y-2 w-full">
        <Label htmlFor="avatar">Profile Picture</Label>
        <div className="flex gap-2">
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            disabled={uploading}
            className="flex-1"
          />
          {uploading && (
            <Button disabled>
              <Upload className="mr-2 h-4 w-4 animate-spin" />
              Uploading
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}