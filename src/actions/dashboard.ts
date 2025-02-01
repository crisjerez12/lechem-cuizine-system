"use server";

import supabase from "@/lib/supabase";

type MonthlyStatsResult = {
  total_sales: number;
  walk_in_count: number;
  online_count: number;
};

export async function getDashboardData() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed

  // Function to get the start of the month for a given year and month
  const getStartOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).toISOString().split("T")[0];
  };

  // Function to get the end of the month for a given year and month
  const getEndOfMonth = (year: number, month: number) => {
    return new Date(year, month, 0).toISOString().split("T")[0];
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
      return { total_sales: 0, walk_in_count: 0, online_count: 0 };
    }

    const total_sales = data.reduce(
      (sum, row) => sum + (row.total_price || 0),
      0
    );
    const walk_in_count = data.filter((row) => row.type === "Walk-in").length;
    const online_count = data.filter((row) => row.type === "online").length;

    return { total_sales, walk_in_count, online_count };
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
      walkIn: monthData.walk_in_count,
      online: monthData.online_count,
    });
  }

  return {
    cardStats: {
      monthlySales: currentMonthStats.total_sales,
      onlineReservations: currentMonthStats.online_count,
      walkInReservations: currentMonthStats.walk_in_count,
    },
    monthlyStats,
  };
}
