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
              <TableCell>{payment.events.title}</TableCell>
              <TableCell>{payment.profiles.username}</TableCell>
              <TableCell>${(payment.amount / 100).toFixed(2)}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(payment.status)}>
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {payment.transaction_id}
              </TableCell>
              <TableCell>
                {payment.status === 'completed' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRefund(payment.id)}
                    disabled={isProcessing}
                  >
                    Refund
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}