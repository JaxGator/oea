import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/hooks/auth/useSession";

interface AlbumCreateFormProps {
  onSuccess: () => void;
}

export function AlbumCreateForm({ onSuccess }: AlbumCreateFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventId, setEventId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { session } = useSession();

  // Fetch events for the dropdown
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('id, title')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create an album",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreating(true);

    try {
      // Create folder path based on title
      const folderPath = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      const { error } = await supabase
        .from('gallery_albums')
        .insert({
          title,
          description,
          event_id: eventId,
          folder_path: folderPath,
          created_by: session.user.id,
        });

      if (error) throw error;

      // Create the folder in storage
      const { error: storageError } = await supabase
        .storage
        .from('gallery')
        .upload(`${folderPath}/.keep`, new Uint8Array(0));

      if (storageError && storageError.message !== 'The resource already exists') {
        throw storageError;
      }

      toast({
        title: "Success",
        description: "Album created successfully",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setEventId(null);
      onSuccess();
    } catch (error) {
      console.error('Error creating album:', error);
      toast({
        title: "Error",
        description: "Failed to create album",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Album Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter album title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter album description"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="event">Associated Event (Optional)</Label>
        <Select value={eventId || 'none'} onValueChange={(value) => setEventId(value === 'none' ? null : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select an event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Event</SelectItem>
            {events?.map((event) => (
              <SelectItem key={event.id} value={event.id}>
                {event.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isCreating}>
        {isCreating ? "Creating..." : "Create Album"}
      </Button>
    </form>
  );
}