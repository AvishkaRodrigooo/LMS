// Frontend: Dashboard.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  useGetPurchasedCoursesQuery,
  useGetSuccessfulPaymentCountQuery,
  useGetStripeBalanceQuery // Add this import
} from "@/features/api/purchaseApi";
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const { data: purchasesData, isLoading, isError } = useGetPurchasedCoursesQuery();
  const { data: countData } = useGetSuccessfulPaymentCountQuery();
  const { data: balanceData, isLoading: balanceLoading } = useGetStripeBalanceQuery();

  if (isLoading || balanceLoading) return <h1>Loading...</h1>;
  if (isError) return <h1 className="text-red-500">Failed to get data</h1>;

  const purchasedCourses = purchasesData?.purchasedCourse || [];
  const balance = balanceData?.balance || { available: 0, pending: 0 };

  // Prepare chart data
  const courseData = purchasedCourses.map(course => ({
    name: course.courseId?.courseTitle || 'Unknown Course',
    price: course.courseId?.coursePrice || 0
  }));

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {/* Stripe Balance Card */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            Stripe Balance (USD)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Available:</span>
              <span className="font-semibold text-green-600">
                ${balance.available.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending:</span>
              <span className="font-semibold text-blue-600">
                ${balance.pending.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Successful Payments Card */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            Successful Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {countData?.count || 0}
          </div>
        </CardContent>
      </Card>

      {/* Course Prices Chart */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            Course Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                angle={-30}
                textAnchor="end"
                interval={0}
              />
              <YAxis stroke="#6b7280" />
              <Tooltip formatter={(value) => [`₹${value}`]} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#4a90e2"
                strokeWidth={3}
                dot={{ stroke: "#4a90e2", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;