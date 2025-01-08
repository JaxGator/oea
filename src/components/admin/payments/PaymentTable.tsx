import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PaymentTable() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data: payments, isLoading, refetch } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: async () => {
      let query = supabase
        .from('payments')
        .select(`
          *,
          events (title),
          profiles (username)
        `)
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`events.title.ilike.%${search}%,profiles.username.ilike.%${search}%`);
      }

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });

  const handleRefund = async (paymentId: string) => {
    try {
      const { error } = await supabase.functions.invoke('process-refund', {
        body: { paymentId }
      });

      if (error) throw error;

      toast({
        title: "Refund processed",
        description: "The payment has been successfully refunded.",
      });

      refetch();
    } catch (error) {
      console.error('Refund error:', error);
      toast({
        title: "Refund failed",
        description: "There was an error processing the refund.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading payments...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search events or users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments?.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.events?.title}</TableCell>
              <TableCell>{payment.profiles?.username}</TableCell>
              <TableCell>${(payment.amount / 100).toFixed(2)}</TableCell>
              <TableCell>{payment.status}</TableCell>
              <TableCell>
                {format(new Date(payment.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                {payment.status === 'completed' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRefund(payment.id)}
                  >
                    Refund
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          {!payments?.length && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No payments found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}