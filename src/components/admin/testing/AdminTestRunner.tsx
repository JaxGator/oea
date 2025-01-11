import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TestResult } from "./types";
import { tests } from "./test-definitions";
import { TestResults } from "./components/TestResults";

export default function AdminTestRunner() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    setProgress(0);

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      const startTime = performance.now();
      
      try {
        await test.run();
        setResults(prev => [...prev, {
          name: test.name,
          category: test.category,
          status: 'passed',
          duration: performance.now() - startTime
        }]);
      } catch (error: any) {
        setResults(prev => [...prev, {
          name: test.name,
          category: test.category,
          status: 'failed',
          error: error.message,
          duration: performance.now() - startTime
        }]);
        
        toast({
          title: `Test Failed: ${test.name}`,
          description: error.message,
          variant: "destructive",
        });
      }
      
      setProgress(((i + 1) / tests.length) * 100);
    }
    
    setIsRunning(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Admin Regression Test Runner</CardTitle>
        <CardDescription>
          Run comprehensive tests to verify admin functionality
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? 'Running Tests...' : 'Start Tests'}
          </Button>

          {isRunning && (
            <Progress value={progress} className="w-full" />
          )}

          <TestResults results={results} />
        </div>
      </CardContent>
    </Card>
  );
}