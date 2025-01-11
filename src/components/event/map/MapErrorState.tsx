interface MapErrorStateProps {
  message: string;
}

export const MapErrorState = ({ message }: MapErrorStateProps) => (
  <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg mb-8 bg-red-50 flex items-center justify-center">
    <div className="text-red-600">{message}</div>
  </div>
);