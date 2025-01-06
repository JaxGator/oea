interface ChatContainerProps {
  children: React.ReactNode;
}

export function ChatContainer({ children }: ChatContainerProps) {
  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-white">
      {children}
    </div>
  );
}