import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function AdminTestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      // Simulate running tests
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast({
        title: "Tests Completed",
        description: "All tests have been successfully run.",
      });
    } catch (error) {
      console.error("Error running tests:", error);
      toast({
        title: "Test Failed",
        description: "There was an error running the tests.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Test Runner</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleRunTests} disabled={isRunning}>
          {isRunning ? "Running Tests..." : "Run Tests"}
        </Button>
      </CardContent>
    </Card>
  );
}

export { AdminTestRunner };
export default AdminTestRunner;
