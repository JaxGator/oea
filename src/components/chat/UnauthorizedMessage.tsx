export function UnauthorizedMessage() {
  return (
    <div className="h-full flex items-center justify-center p-4 bg-gray-50">
      <div className="text-center">
        <p className="text-gray-500">
          You are not authorized to view this conversation.
        </p>
      </div>
    </div>
  );
}