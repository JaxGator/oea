import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Payment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  transaction_id: string;
  events: { title: string };
  profiles: { username: string };
}

interface PaymentTableProps {
  payments: Payment[];
  isProcessing: boolean;
  onRefund: (paymentId: string) => void;
}

export function PaymentTable({ payments, isProcessing, onRefund }: PaymentTableProps) {
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      case 'refunded':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleRefund = async (paymentId: string) => {
    try {
      await onRefund(paymentId);
    } catch (error) {
      console.error('Error processing refund:', error);
      toast({
        title: "Error",
        description: "Failed to process refund. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!Array.isArray(payments)) {
    console.error('Invalid payments data:', payments);
    return (
      <div className="p-4 text-red-500">
        Error loading payment data. Please try refreshing the page.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                {format(new Date(payment.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>{payment.events?.title || 'N/A'}</TableCell>
              <TableCell>{payment.profiles?.username || 'N/A'}</TableCell>
              <TableCell>${(payment.amount / 100).toFixed(2)}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(payment.status)}>
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {payment.transaction_id || 'N/A'}
              </TableCell>
              <TableCell>
                {payment.status === 'completed' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRefund(payment.id)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Refund'}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          {payments.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No payments found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}