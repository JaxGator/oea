
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SEND_TIMEOUT = 30000; // 30 seconds timeout
const MAX_RETRIES = 2;
const BASE_DELAY = 1000; // Start with 1 second delay

export function ContactAdminDialog() {
  const { toast } = useToast();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [submitAttempts, setSubmitAttempts] = useState(0);

  const handleContactSubmit = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    if (isSubmitting) {
      console.log('Preventing duplicate submission');
      return;
    }

    setIsSubmitting(true);
    setSubmitAttempts(prev => prev + 1);

    const attemptSubmission = async (retry = 0): Promise<boolean> => {
      try {
        console.log(`Attempting to send message (attempt ${retry + 1}/${MAX_RETRIES + 1})`);
        
        const { data, error } = await supabase.functions.invoke('send-admin-message', {
          body: { message: trimmedMessage }
        });

        console.log('Response:', { data, error });

        if (error) {
          throw error;
        }

        if (!data?.success) {
          throw new Error(data?.error || 'Failed to send message');
        }

        // Also create a local auth_notification record for immediate feedback
        try {
          const { error: authNotifError } = await supabase
            .from('auth_notifications')
            .insert({
              type: 'contact',
              message: 'User contact message', 
              metadata: trimmedMessage, // Store full message in metadata
              is_read: false
            });

          if (authNotifError) {
            console.error('Error creating local auth notification:', authNotifError);
          }
        } catch (authErr) {
          console.error('Failed to create auth notification:', authErr);
        }

        toast({
          title: "Message Sent",
          description: "An administrator will respond to your message soon.",
        });

        setMessage("");
        setIsContactOpen(false);
        setSubmitAttempts(0);
        return true;

      } catch (error) {
        console.error('Send error:', error);
        
        if (retry < MAX_RETRIES) {
          const backoffDelay = BASE_DELAY * Math.pow(2, retry);
          console.log(`Retrying in ${backoffDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
          return attemptSubmission(retry + 1);
        }

        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    };

    try {
      const success = await attemptSubmission();
      if (!success) {
        console.log('All submission attempts failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={isContactOpen} 
      onOpenChange={(open) => {
        if (!isSubmitting) {
          setIsContactOpen(open);
          if (!open) {
            setMessage("");
            setSubmitAttempts(0);
          }
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Contact Us
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact Administrator</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Textarea
              placeholder="Your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
          </div>
          <Button 
            className="w-full relative"
            onClick={handleContactSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {submitAttempts > 1 ? `Retrying (${submitAttempts}/${MAX_RETRIES + 1})` : "Sending..."}
              </span>
            ) : (
              <span className="flex items-center justify-center">
                Send Message <Send className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
