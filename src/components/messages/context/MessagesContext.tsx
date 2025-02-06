
import { createContext, useContext, useState } from "react";
import { Message, ConversationType } from "../types/conversation";

interface MessagesContextType {
  selectedConversation: string | null;
  setSelectedConversation: (id: string | null) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  isDeleting: boolean;
  setIsDeleting: (isDeleting: boolean) => void;
  isSending: boolean;
  setIsSending: (isSending: boolean) => void;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSending, setIsSending] = useState(false);

  return (
    <MessagesContext.Provider
      value={{
        selectedConversation,
        setSelectedConversation,
        showDeleteDialog,
        setShowDeleteDialog,
        isDeleting,
        setIsDeleting,
        isSending,
        setIsSending,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessagesProvider");
  }
  return context;
}
