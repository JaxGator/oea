import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Communication, MessageTemplate, RecipientList } from "@/types/communications";
import { useNotifications } from "@/components/providers/NotificationProvider";

type NewCommunication = Pick<Communication, 'subject' | 'content' | 'recipient_type' | 'recipient_data'> & Partial<Omit<Communication, 'subject' | 'content' | 'recipient_type' | 'recipient_data'>>;

type NewMessageTemplate = Pick<MessageTemplate, 'name' | 'subject' | 'content'> & Partial<Omit<MessageTemplate, 'name' | 'subject' | 'content'>>;

export function useCommunications() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  const templatesQuery = useQuery({
    queryKey: ['message-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as MessageTemplate[];
    }
  });

  const recipientListsQuery = useQuery({
    queryKey: ['recipient-lists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipient_lists')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as RecipientList[];
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (communication: NewCommunication) => {
      const { data, error } = await supabase
        .from('communications')
        .insert([communication])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      notify("success", "Message Sent", "Your message has been queued for delivery");
      queryClient.invalidateQueries({ queryKey: ['communications'] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      notify("error", "Send Failed", "Failed to send message. Please try again.");
    }
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (template: NewMessageTemplate) => {
      const { data, error } = await supabase
        .from('message_templates')
        .insert([template])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      notify("success", "Template Created", "Message template has been saved");
      queryClient.invalidateQueries({ queryKey: ['message-templates'] });
    },
    onError: (error) => {
      console.error('Error creating template:', error);
      notify("error", "Template Creation Failed", "Failed to create template. Please try again.");
    }
  });

  return {
    templates: templatesQuery.data ?? [],
    recipientLists: recipientListsQuery.data ?? [],
    isLoading: templatesQuery.isLoading || recipientListsQuery.isLoading,
    error: templatesQuery.error || recipientListsQuery.error,
    sendMessage: sendMessageMutation.mutate,
    createTemplate: createTemplateMutation.mutate,
  };
}