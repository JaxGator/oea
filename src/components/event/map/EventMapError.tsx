interface EventMapErrorProps {
  error: string;
}

export function EventMapError({ error }: EventMapErrorProps) {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg mb-8 bg-gray-100 flex items-center justify-center">
      <p className="text-gray-600">Unable to load map: {error}</p>
    </div>
  );
}