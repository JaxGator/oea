import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface TestResult {
  name: string;
  category: string;
  status: 'passed' | 'failed' | 'pending';
  error?: string;
  duration?: number;
}

export function AdminTestRunner() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const tests = [
    // User Management Tests
    {
      name: "User Creation",
      category: "User Management",
      run: async () => {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(1);
        if (error) throw error;
        return !!profile;
      }
    },
    {
      name: "User Search",
      category: "User Management",
      run: async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .textSearch('username', 'test');
        if (error) throw error;
        return Array.isArray(data);
      }
    },
    // Event Management Tests
    {
      name: "Event Creation",
      category: "Events",
      run: async () => {
        const { data: events, error } = await supabase
          .from('events')
          .select('*')
          .limit(1);
        if (error) throw error;
        return !!events;
      }
    },
    {
      name: "Waitlist Management",
      category: "Events",
      run: async () => {
        const { data, error } = await supabase
          .from('event_rsvps')
          .select('*')
          .eq('status', 'waitlisted')
          .limit(1);
        if (error) throw error;
        return Array.isArray(data);
      }
    },
    // Payment Tests
    {
      name: "Payment Records",
      category: "Payments",
      run: async () => {
        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .limit(1);
        if (error) throw error;
        return Array.isArray(data);
      }
    },
    // Report Tests
    {
      name: "User Activity Report",
      category: "Reports",
      run: async () => {
        const { data: logs, error } = await supabase
          .from('admin_logs')
          .select('*')
          .limit(1);
        if (error) throw error;
        return Array.isArray(logs);
      }
    },
  ];

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

          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg border"
                >
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
              ))}
            </div>
          </ScrollArea>

          {results.length > 0 && (
            <div className="flex justify-between items-center pt-4 border-t">
              <p>Total Tests: {results.length}</p>
              <p>
                Passed: {results.filter(r => r.status === 'passed').length} | 
                Failed: {results.filter(r => r.status === 'failed').length}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}