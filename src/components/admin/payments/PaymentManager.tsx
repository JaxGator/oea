import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PaymentTable } from "./PaymentTable";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { AdminErrorBoundary } from "../error/AdminErrorBoundary";

export default function PaymentManager() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: payments, isLoading, error } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          events (
            title
          ),
          profiles (
            username
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payments:', error);
        throw error;
      }

      return data;
    },
  });

  const processRefundMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      const { data, error } = await supabase.functions.invoke('process-refund', {
        body: { paymentId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "The refund has been processed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: (error) => {
      console.error('Refund error:', error);
      toast({
        title: "Refund Failed",
        description: error instanceof Error ? error.message : "Failed to process refund. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRefund = async (paymentId: string) => {
    setIsProcessing(true);
    try {
      await processRefundMutation.mutateAsync(paymentId);
    } finally {
      setIsProcessing(false);
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Error loading payments: {error instanceof Error ? error.message : "Unknown error"}</p>
            <Button 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['payments'] })}
              variant="outline"
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <AdminErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle>Payment Management</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentTable
            payments={payments || []}
            isProcessing={isProcessing}
            onRefund={handleRefund}
          />
        </CardContent>
      </Card>
    </AdminErrorBoundary>
  );
}