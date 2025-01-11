import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TestResult {
  name: string;
  status: 'passed' | 'failed';
  category: string;
  error?: string;
  duration?: number;
}

interface TestResultsProps {
  results: TestResult[];
}

export function TestResults({ results }: TestResultsProps) {
  const passedTests = results.filter(r => r.status === 'passed').length;
  const failedTests = results.filter(r => r.status === 'failed').length;
  
  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      auth: 'bg-blue-100 text-blue-800',
      events: 'bg-green-100 text-green-800',
      members: 'bg-purple-100 text-purple-800',
      content: 'bg-yellow-100 text-yellow-800',
      admin: 'bg-red-100 text-red-800',
      navigation: 'bg-indigo-100 text-indigo-800',
      ui: 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Test Results</span>
          <div className="flex gap-4 text-sm">
            <Badge variant="outline" className="bg-green-50">
              Passed: {passedTests}
            </Badge>
            <Badge variant="outline" className="bg-red-50">
              Failed: {failedTests}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.status === 'passed' ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <h4 className="font-medium">{result.name}</h4>
                      {result.error && (
                        <p className="text-sm text-red-600 mt-1">{result.error}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(result.category)}>
                      {result.category}
                    </Badge>
                    {result.duration && (
                      <span className="text-sm text-gray-500">
                        {result.duration.toFixed(2)}ms
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}