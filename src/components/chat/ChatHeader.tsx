import { useState } from "react";
import { Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ChatHeaderProps {
  chatTitle: string;
  setChatTitle: (title: string) => void;
  isAdmin: boolean;
}

export function ChatHeader({ chatTitle, setChatTitle, isAdmin }: ChatHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const { toast } = useToast();

  const handleUpdateTitle = async () => {
    if (!tempTitle.trim()) return;

    try {
      const { error } = await supabase
        .from('site_config')
        .update({ value: tempTitle })
        .eq('key', 'group_chat_title');

      if (error) throw error;

      setChatTitle(tempTitle);
      setIsEditingTitle(false);
      toast({
        title: "Success",
        description: "Chat title updated successfully",
      });
    } catch (error) {
      console.error('Error updating chat title:', error);
      toast({
        title: "Error",
        description: "Failed to update chat title",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 border-b flex items-center justify-between">
      {isEditingTitle && isAdmin ? (
        <div className="flex items-center gap-2 flex-1">
          <Input
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            className="max-w-md"
            placeholder="Enter chat title"
          />
          <Button
            onClick={handleUpdateTitle}
            size="sm"
            className="bg-green-500 hover:bg-green-600"
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{chatTitle}</h2>
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setTempTitle(chatTitle);
                setIsEditingTitle(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}