export function UnauthorizedMessage() {
  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-white">
      <div className="p-4 text-center text-gray-500">
        Your account needs to be approved to participate in group chat.
      </div>
    </div>
  );
}