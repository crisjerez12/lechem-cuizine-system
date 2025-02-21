"use server";

import supabase from "@/lib/supabase";

type ItemType = {
  reservation_date: string;
  name: string;
  location: string;
};

export async function getCalendarData() {
  const { data, error } = await supabase
    .from("official_reservations")
    .select("reservation_date, name, location")
    .gte("reservation_date", new Date().toISOString());

  if (error) {
    console.error("Error fetching reservations:", error);
    throw new Error("Failed to fetch reservations");
  }

  const reservations = data.map((item: ItemType) => ({
    reservation_date: new Date(item.reservation_date),
    name: item.name,
    location: item.location,
  }));

  return reservations;
}
