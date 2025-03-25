import { useEffect } from 'react';
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
import {
  useGetPurchasedCoursesQuery,
  useGetSuccessfulPaymentCountQuery,
  useGetStripeBalanceQuery,
  useGetStripeTransactionsQuery,
} from "@/features/api/purchaseApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  // Fetch all data
  const {
    data: purchasesData,
    isLoading: purchasesLoading,
    error: purchasesError,
  } = useGetPurchasedCoursesQuery();
  
  const {
    data: countData,
    isLoading: countLoading,
    error: countError,
  } = useGetSuccessfulPaymentCountQuery();
  
  const {
    data: balanceData,
    isLoading: balanceLoading,
    error: balanceError,
  } = useGetStripeBalanceQuery();
  
  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useGetStripeTransactionsQuery();

  // Combined loading state
  const isLoading = purchasesLoading || countLoading || balanceLoading || transactionsLoading;
  const isError = purchasesError || countError || balanceError || transactionsError;

  // Data preparation
  const purchasedCourses = purchasesData?.purchasedCourse || [];
  const balance = balanceData?.balance || { available: 0, pending: 0 };
  const transactions = transactionsData?.transactions || [];

  // Chart data formatting
  const courseData = purchasedCourses.map(course => ({
    name: course.courseId?.courseTitle?.substring(0, 15) + '...' || 'Course',
    price: course.courseId?.coursePrice || 0,
  }));

  if (isLoading) return <div className="p-4 text-center">Loading Dashboard...</div>;
  if (isError) return <div className="p-4 text-red-500">Error loading dashboard data</div>;

  return (
    <div className="space-y-6 p-4">
      {/* Top Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Balance Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Stripe Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Available:</span>
                <span className="font-semibold text-green-600">
                  ${balance.available.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Pending:</span>
                <span className="font-semibold text-blue-600">
                  ${balance.pending.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Successful Payments Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Successful Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {countData?.count || 0}
            </div>
          </CardContent>
        </Card>

        {/* Total Courses Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {purchasedCourses.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
       

        {/* Recent Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      {new Date(tx.created).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>{tx.customer_email}</TableCell>
                    <TableCell>{tx.payment_method}</TableCell>
                    <TableCell>
                      {tx.amount.toLocaleString('en-US', {
                        style: 'currency',
                        currency: tx.currency,
                      })}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded ${
                          tx.status === 'succeeded'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;