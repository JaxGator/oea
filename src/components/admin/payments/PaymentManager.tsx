import { Card } from "@/components/ui/card";
import { PaymentTable } from "./PaymentTable";

export function PaymentManager() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Payment Management</h2>
      <PaymentTable />
    </Card>
  );
}