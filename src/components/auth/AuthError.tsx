
export function AuthError({ error }: { error: string | null }) {
  if (!error) return null;
  
  return (
    <div className="mb-4 p-4 text-sm text-red-800 bg-red-100 rounded-lg">
      {error}
    </div>
  );
}
