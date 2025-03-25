import { useGetStripeTransactionsQuery } from "@/features/api/purchaseApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";

const Payment = () => {
  const {
    data: transactionsData,
    isLoading,
    error,
  } = useGetStripeTransactionsQuery();

  const transactions = transactionsData?.transactions || [];

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Payment Transactions", 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [["Date", "Customer", "Method", "Amount", "Status"]],
      body: transactions.map((tx) => [
        new Date(tx.created).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        tx.customer_email,
        tx.payment_method,
        tx.amount.toLocaleString("en-US", {
          style: "currency",
          currency: tx.currency,
        }),
        tx.status,
      ]),
    });
    doc.save("transactions.pdf");
  };

  if (isLoading)
    return <div className="p-4 text-center text-gray-800 dark:text-gray-200">Loading transactions...</div>;
  if (error)
    return <div className="p-4 text-red-500 dark:text-red-400">Error loading transactions</div>;

  return (
    <Card className="shadow-lg border-0 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Payment Transactions
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <button 
            onClick={exportPDF} 
            className="flex items-center gap-5 px-3 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            <Download size={16} />
            Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader className="bg-gray-100 dark:bg-gray-700">
              <TableRow>
                <TableHead className="w-[150px] font-medium text-gray-600 dark:text-gray-300">
                  Date
                </TableHead>
                <TableHead className="font-medium text-gray-600 dark:text-gray-300">
                  Customer
                </TableHead>
                <TableHead className="font-medium text-gray-600 dark:text-gray-300">
                  Method
                </TableHead>
                <TableHead className="text-right font-medium text-gray-600 dark:text-gray-300">
                  Amount
                </TableHead>
                <TableHead className="font-medium text-gray-600 dark:text-gray-300">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow
                  key={tx.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <TableCell className="font-medium">
                    {new Date(tx.created).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">
                    {tx.customer_email}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100">
                      {tx.payment_method}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium text-gray-900 dark:text-gray-200">
                      {tx.amount.toLocaleString("en-US", {
                        style: "currency",
                        currency: tx.currency,
                      })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        tx.status === "succeeded"
                          ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200"
                          : "bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {transactions.length === 0 && (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No transactions found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Payment;