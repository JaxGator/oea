import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TestResultsProps {
  results: Array<{
    name: string;
    status: string;
    error?: string;
    duration?: number;
  }>;
}

export function TestResults({ results }: TestResultsProps) {
  const passedTests = results.filter(r => r.status === 'passed').length;
  const failedTests = results.filter(r => r.status === 'failed').length;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Total Tests: {results.length}</span>
            <span className="text-green-500">Passed: {passedTests}</span>
            <span className="text-red-500">Failed: {failedTests}</span>
          </div>
          
          <ScrollArea className="h-[300px]">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-2 border-b ${
                  result.status === 'passed' ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <div className="flex justify-between">
                  <span className="font-medium">{result.name}</span>
                  <span>{result.duration?.toFixed(2)}ms</span>
                </div>
                {result.error && (
                  <p className="text-sm text-red-600 mt-1">{result.error}</p>
                )}
              </div>
            ))}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}