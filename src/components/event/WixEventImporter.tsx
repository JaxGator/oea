import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";

interface WixEvent {
  title: string;
  rsvp_guests: number;
  start_date: string;
  location: string;
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
      const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
      
      const events: WixEvent[] = lines.slice(1)
        .filter(line => line.trim() !== '')
        .map(line => {
          // Handle possible commas within quoted strings
          const values: string[] = [];
          let currentValue = '';
          let insideQuotes = false;
          
          for (let char of line) {
            if (char === '"') {
              insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
              values.push(currentValue.trim());
              currentValue = '';
            } else {
              currentValue += char;
            }
          }
          values.push(currentValue.trim());

          const event: WixEvent = {
            title: values[headers.indexOf('title')] || '',
            rsvp_guests: parseInt(values[headers.indexOf('rsvp guests')]) || 0,
            start_date: values[headers.indexOf('start date')] || '',
            location: values[headers.indexOf('location')] || ''
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
        // Parse the date and time from the ISO string
        const eventDate = new Date(event.start_date);
        const formattedDate = eventDate.toISOString().split('T')[0];
        const formattedTime = eventDate.toTimeString().split(' ')[0].substring(0, 5);

        const { data, error } = await supabase.rpc('import_wix_event' as any, {
          p_title: event.title,
          p_description: 'Imported from Wix',
          p_date: formattedDate,
          p_time: formattedTime,
          p_location: event.location || 'Location TBA',
          p_max_guests: Math.max(50, event.rsvp_guests + 10), // Set max guests to at least 50 or rsvp_guests + 10
          p_created_by: user.id,
          p_image_url: '/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png',
          p_rsvp_count: event.rsvp_guests
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
      window.location.reload(); // Refresh to show new events
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
            Upload a CSV file with columns: title, rsvp guests, start date, location
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
                    {new Date(event.start_date).toLocaleDateString()} - {event.location || 'Location TBA'}
                  </p>
                  <p className="text-sm text-gray-600">
                    RSVP Count: {event.rsvp_guests}
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