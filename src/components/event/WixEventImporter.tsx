import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";

interface WixEvent {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxGuests: number;
  imageUrl?: string;
  createdAt?: string;
}

export function WixEventImporter() {
  const [csvData, setCsvData] = useState<WixEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthState();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(header => header.trim());
      
      const events: WixEvent[] = lines.slice(1)
        .filter(line => line.trim() !== '')
        .map(line => {
          const values = line.split(',').map(value => value.trim());
          const event: WixEvent = {
            title: values[headers.indexOf('title')] || '',
            description: values[headers.indexOf('description')] || '',
            date: values[headers.indexOf('date')] || '',
            time: values[headers.indexOf('time')] || '12:00',
            location: values[headers.indexOf('location')] || '',
            maxGuests: parseInt(values[headers.indexOf('maxGuests')]) || 50,
            imageUrl: values[headers.indexOf('imageUrl')],
            createdAt: values[headers.indexOf('createdAt')]
          };
          return event;
        });

      setCsvData(events);
    };
    reader.readAsText(file);
  };

  const importEvents = async () => {
    if (!user) {
      toast.error("You must be logged in to import events");
      return;
    }

    setIsLoading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const event of csvData) {
      try {
        const { data, error } = await supabase.rpc('import_wix_event', {
          p_title: event.title,
          p_description: event.description,
          p_date: event.date,
          p_time: event.time,
          p_location: event.location,
          p_max_guests: event.maxGuests,
          p_created_by: user.id,
          p_image_url: event.imageUrl,
          p_created_at: event.createdAt || new Date().toISOString()
        });

        if (error) throw error;
        successCount++;
      } catch (error) {
        console.error('Error importing event:', error);
        errorCount++;
      }
    }

    setIsLoading(false);
    if (successCount > 0) {
      toast.success(`Successfully imported ${successCount} events`);
    }
    if (errorCount > 0) {
      toast.error(`Failed to import ${errorCount} events`);
    }
    setCsvData([]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Import Wix Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <p className="text-sm text-gray-500">
            Upload a CSV file with columns: title, description, date (YYYY-MM-DD), time (HH:MM), location, maxGuests, imageUrl (optional)
          </p>
        </div>

        {csvData.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Preview ({csvData.length} events):</h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {csvData.map((event, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-gray-600">
                    {event.date} at {event.time} - {event.location}
                  </p>
                </div>
              ))}
            </div>
            <Button 
              onClick={importEvents} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Importing...' : 'Import Events'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}