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
  ResponsiveContainer 
} from "recharts";
import { Users, ShoppingBag, UserCheck } from "lucide-react";

interface MonthlyStats {
  month: string;
  walkIn: number;
  online: number;
}

export default function Dashboard() {
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([
    { month: "January", walkIn: 45, online: 30 },
    { month: "February", walkIn: 52, online: 38 },
    { month: "March", walkIn: 48, online: 42 },
    { month: "April", walkIn: 55, online: 48 },
    { month: "May", walkIn: 58, online: 52 },
    { month: "June", walkIn: 62, online: 58 }
  ]);

  const currentStats = {
    monthlySales: 458000,
    onlineReservations: 58,
    walkInReservations: 62
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white/70 backdrop-blur-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Monthly Sales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{currentStats.monthlySales.toLocaleString()}</div>
            <p className="text-xs text-gray-500">For the month of June</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Online Reservations</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.onlineReservations}</div>
            <p className="text-xs text-gray-500">Bookings this month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Walk-in Reservations</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.walkInReservations}</div>
            <p className="text-xs text-gray-500">Direct bookings this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Reservations Chart */}
      <Card className="bg-white/70 backdrop-blur-lg p-6">
        <CardHeader>
          <CardTitle>Reservation Trends</CardTitle>
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
                  <linearGradient id="walkInGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="onlineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748B"
                  tick={{ fill: '#64748B' }}
                />
                <YAxis 
                  stroke="#64748B"
                  tick={{ fill: '#64748B' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value: number) => [`${value} Reservations`, '']}
                />
                <Legend 
                  wrapperStyle={{
                    paddingTop: '20px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="walkIn"
                  name="Walk-in Reservations"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#walkInGradient)"
                  strokeWidth={2}
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