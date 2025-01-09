import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface MemberPageErrorProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function MemberPageError({ error, resetErrorBoundary }: MemberPageErrorProps) {
  const { toast } = useToast();

  useEffect(() => {
    console.error('Member page error:', error);
    toast({
      title: "Error loading members",
      description: "There was a problem loading the member list. Please try again.",
      variant: "destructive",
    });
  }, [error, toast]);

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <h3 className="text-lg font-semibold">Error Loading Members</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          There was a problem loading the member list. This could be due to a network issue or server problem.
        </p>
        <Button 
          onClick={resetErrorBoundary}
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}