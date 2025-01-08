import { Card } from "@/components/ui/card";

interface PageLoadTime {
  page: string;
  loadTime: number;
}

interface PageLoadTimesCardProps {
  loadTimes: PageLoadTime[];
}

export function PageLoadTimesCard({ loadTimes }: PageLoadTimesCardProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Page Load Times</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Page</th>
              <th className="text-left p-2">Load Time (seconds)</th>
            </tr>
          </thead>
          <tbody>
            {loadTimes.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{item.page}</td>
                <td className="p-2">{item.loadTime.toFixed(2)}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}