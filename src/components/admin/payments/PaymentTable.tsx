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

export function PaymentTable() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          events (title),
          profiles (username)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading payments...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
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
          </TableRow>
        ))}
        {!payments?.length && (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No payments found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}