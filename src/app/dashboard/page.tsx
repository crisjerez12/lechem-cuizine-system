"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Users, ShoppingBag } from "lucide-react";
import { getDashboardData } from "@/actions/dashboard";
import { CardSkeleton, ChartSkeleton } from "@/components/skeleton-loaders";

interface MonthlyStats {
  month: string;
  online: number;
}
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export default function Dashboard() {
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentMonth = months[new Date().getMonth()];
  const [stats, setStats] = useState({
    monthlySales: 0,
    onlineReservations: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getDashboardData();
        setMonthlyStats(res.monthlyStats);
        setStats(res.cardStats);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <ChartSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 ">
        <Card className="bg-white/70 backdrop-blur-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Monthly Sales
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₱{stats.monthlySales.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">
              For the month of {currentMonth}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Online Reservations
            </CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onlineReservations}</div>
            <p className="text-xs text-gray-500">Bookings this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Reservations Chart */}
      <Card className="bg-white/70 backdrop-blur-lg p-6">
        <CardHeader>
          <CardTitle>Monthly Reservation Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyStats}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient
                    id="onlineGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="month"
                  stroke="#64748B"
                  tick={{ fill: "#64748B" }}
                />
                <YAxis stroke="#64748B" tick={{ fill: "#64748B" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value: number) => [`${value} Reservations`, ""]}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="online"
                  name="Online Reservations"
                  stroke="#8B5CF6"
                  fillOpacity={1}
                  fill="url(#onlineGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
