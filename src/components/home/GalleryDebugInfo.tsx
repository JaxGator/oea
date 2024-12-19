interface DebugInfoProps {
  isLoading: boolean;
  isConnected: boolean | null;
  error: string | null;
  imagesCount: number;
}

export const GalleryDebugInfo = ({ isLoading, isConnected, error, imagesCount }: DebugInfoProps) => {
  return (
    <div className="bg-yellow-100 p-2 rounded">
      <p>Debug Information:</p>
      <ul className="list-disc pl-4">
        <li>Loading: {isLoading ? 'true' : 'false'}</li>
        <li>Connection Status: {isConnected === null ? 'testing' : isConnected ? 'connected' : 'disconnected'}</li>
        <li>Error: {error || 'none'}</li>
        <li>Images found: {imagesCount}</li>
      </ul>
    </div>
  );
};