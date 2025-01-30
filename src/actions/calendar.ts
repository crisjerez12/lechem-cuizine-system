"use server";

import supabase from "@/lib/supabase";

export async function getCalendarData() {
  const { data, error } = await supabase
    .from("official_reservations")
    .select("reservation_date")
    .gte("reservation_date", new Date().toISOString());

  if (error) {
    console.error("Error fetching reservations:", error);
    throw new Error("Failed to fetch reservations");
  }

  const allDates = data.map((item) => item.reservation_date);

  return allDates;
}
