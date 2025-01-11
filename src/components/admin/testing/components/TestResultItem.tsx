import { TestResult } from "../types";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface TestResultItemProps {
  result: TestResult;
}

export function TestResultItem({ result }: TestResultItemProps) {
  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-lg border">
      <div className="flex items-center space-x-2">
        {getStatusIcon(result.status)}
        <div>
          <p className="font-medium">{result.name}</p>
          <p className="text-sm text-muted-foreground">
            {result.duration?.toFixed(2)}ms
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge variant={result.status === 'passed' ? 'default' : 'destructive'}>
          {result.category}
        </Badge>
      </div>
    </div>
  );
}