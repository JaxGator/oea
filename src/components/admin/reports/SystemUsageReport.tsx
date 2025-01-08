import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DateRange } from "react-day-picker";
import { ServiceHealthCard } from "./service-health/ServiceHealthCard";
import { useServiceHealth } from "./service-health/useServiceHealth";
import { APIMetricsCard } from "./metrics/APIMetricsCard";
import { SuccessRateCard } from "./metrics/SuccessRateCard";
import { PageLoadTimesCard } from "./page-load/PageLoadTimesCard";

// Define actual pages in the application
const APP_PAGES = [
  { route: '/', name: 'Home' },
  { route: '/events', name: 'Events' },
  { route: '/about', name: 'About' },
  { route: '/members', name: 'Members' },
  { route: '/profile', name: 'Profile' },
  { route: '/admin', name: 'Admin Dashboard' },
  { route: '/resources', name: 'Resources' },
  { route: '/store', name: 'Store' }
];

export function SystemUsageReport() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { data: serviceHealth, isLoading: healthLoading } = useServiceHealth();

  // Query for system stats
  const { data: systemStats, isLoading: statsLoading } = useQuery({
    queryKey: ['system-stats', dateRange],
    queryFn: async () => {
      // This would be replaced with actual API metrics data
      return {
        apiRequests: Array.from({ length: 7 }, (_, i) => ({
          date: `Day ${i + 1}`,
          requests: Math.floor(Math.random() * 1000),
          errors: Math.floor(Math.random() * 100),
        })),
        successRate: {
          success: 95,
          failure: 5,
        },
        loadTimes: APP_PAGES.map(page => ({
          page: page.name,
          loadTime: Math.random() * 2, // Simulated load times between 0-2 seconds
        })),
      };
    },
  });

  const handleExport = () => {
    console.log("Exporting system data...");
  };

  if (statsLoading || healthLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <DatePickerWithRange
          value={dateRange}
          onChange={(newDateRange: DateRange | undefined) => setDateRange(newDateRange)}
        />
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <ServiceHealthCard serviceHealth={serviceHealth} />

      <div className="grid md:grid-cols-2 gap-6">
        <APIMetricsCard apiRequests={systemStats?.apiRequests || []} />
        <SuccessRateCard successRate={systemStats?.successRate || { success: 0, failure: 0 }} />
      </div>

      <PageLoadTimesCard loadTimes={systemStats?.loadTimes || []} />
    </div>
  );
}