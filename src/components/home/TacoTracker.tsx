
import { Map } from 'lucide-react';

export function TacoTracker() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-2 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Map className="h-6 w-6" />
          Taco Tracker™
        </h2>
      </div>
      <div className="w-full">
        <iframe 
          src="https://www.google.com/maps/d/u/0/embed?mid=1Sd2v6yMuYMnEzibKoVczh5-KzLVDqqo&ehbc=2E312F" 
          className="w-full h-[480px] rounded-lg border shadow-sm"
          title="Taco Tracker Map"
        />
      </div>
    </div>
  );
}
