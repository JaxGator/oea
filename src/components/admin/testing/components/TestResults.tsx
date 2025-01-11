import { ScrollArea } from "@/components/ui/scroll-area";
import { TestResult } from "../types";
import { TestResultItem } from "./TestResultItem";

interface TestResultsProps {
  results: TestResult[];
}

export function TestResults({ results }: TestResultsProps) {
  const passedTests = results.filter(r => r.status === 'passed').length;
  const failedTests = results.filter(r => r.status === 'failed').length;

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
        <div className="space-y-4">
          {results.map((result, index) => (
            <TestResultItem key={index} result={result} />
          ))}
        </div>
      </ScrollArea>

      {results.length > 0 && (
        <div className="flex justify-between items-center pt-4 border-t">
          <p>Total Tests: {results.length}</p>
          <p>
            Passed: {passedTests} | Failed: {failedTests}
          </p>
        </div>
      )}
    </div>
  );
}