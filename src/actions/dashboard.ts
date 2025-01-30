"use server";

export async function getDashboardData() {
  // Simulated dashboard data
  return {
    monthlySales: 458000,
    onlineReservations: 58,
    walkInReservations: 62,
    monthlyStats: [
      { month: "January", walkIn: 45, online: 30 },
      { month: "February", walkIn: 52, online: 38 },
      { month: "March", walkIn: 48, online: 42 },
      { month: "April", walkIn: 55, online: 48 },
      { month: "May", walkIn: 58, online: 52 },
      { month: "June", walkIn: 62, online: 58 }
    ]
  };
}