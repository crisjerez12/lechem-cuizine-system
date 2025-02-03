"use server";

import supabase from "@/lib/supabase";

type MonthlyStatsResult = {
  total_sales: number;
  online_count: number;
};

export async function getDashboardData() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed

  // Function to get the number of days in a given month and year
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate() + 1; // Setting day to 0 returns last day of previous month
  };

  // Function to get the start of the month
  const getStartOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 2).toISOString().split("T")[0]; // Month is 0-based
  };

  // Function to get the end of the month
  const getEndOfMonth = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    return new Date(year, month - 1, daysInMonth).toISOString().split("T")[0]; // Month is 0-based
  };
  // Function to get monthly stats
  async function getMonthlyStats(
    startDate: string,
    endDate: string
  ): Promise<MonthlyStatsResult> {
    const { data, error } = await supabase
      .from("official_reservations")
      .select("*")
      .gte("reservation_date", startDate)
      .lte("reservation_date", endDate);

    if (error) {
      console.error("Error fetching data:", error);
      return { total_sales: 0, online_count: 0 };
    }

    const total_sales = data.reduce(
      (sum, row) => sum + (row.total_price || 0),
      0
    );
    const walk_in_count = data.filter((row) => row.type === "Walk-in").length;
    const online_count = data.filter((row) => row.type === "online").length;

    return { total_sales, online_count };
  }

  // Get current month stats
  const currentMonthStats = await getMonthlyStats(
    getStartOfMonth(currentYear, currentMonth),
    getEndOfMonth(currentYear, currentMonth)
  );

  // Get monthly stats for the past 6 months
  const monthlyStats = [];
  for (let i = 0; i < 6; i++) {
    const targetMonth = currentMonth - i;
    const targetYear = currentYear - Math.floor(Math.abs(targetMonth) / 12);
    const adjustedMonth = ((targetMonth - 1 + 12) % 12) + 1;

    const monthData = await getMonthlyStats(
      getStartOfMonth(targetYear, adjustedMonth),
      getEndOfMonth(targetYear, adjustedMonth)
    );

    monthlyStats.unshift({
      month: new Date(targetYear, adjustedMonth - 1, 1).toLocaleString(
        "default",
        { month: "long" }
      ),
      online: monthData.online_count,
    });
  }

  return {
    cardStats: {
      monthlySales: currentMonthStats.total_sales,
      onlineReservations: currentMonthStats.online_count,
    },
    monthlyStats,
  };
}
