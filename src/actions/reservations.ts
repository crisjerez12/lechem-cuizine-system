"use server";

import supabase from "@/lib/supabase";
import type { Reservation, ReservationForm } from "@/lib/types/reservationType";

export async function getReservations(
  page = 1,
  pageSize = 10,
  startDate?: string,
  endDate?: string
) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  console.log(startDate, endDate);
  let query = supabase
    .from("official_reservations")
    .select("*", { count: "exact" })
    .order("reservation_date", { ascending: false });

  if (startDate && endDate) {
    query = query
      .gte("reservation_date", startDate)
      .lte("reservation_date", endDate);
  } else {
    query = query.range(start, end);
  }

  const { data, error, count } = await query;
  if (error) {
    return {
      success: false,
      error,
      data: [],
      count: 0,
    };
  }

  return {
    success: true,
    error: null,
    data,
    count,
  };
}

export async function addReservation(
  data: ReservationForm
): Promise<{ success: boolean; reservation?: Reservation; error?: string }> {
  console.log(data);
  const { data: newReservation, error } = await supabase
    .from("official_reservations")
    .insert([
      {
        name: data.name,
        mobile_number: data.mobile_number,
        location: data.location,
        package: data.package,
        notes: data.notes,
        pax: data.pax,
        reservation_date: data.reservation_date,
        total_price: data.total_price,
        type: data.type || "Walk-in",
      },
    ])
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, reservation: newReservation };
}

export async function updateReservation(
  id: number,
  data: Partial<Reservation>
): Promise<{ success: boolean; reservation?: Reservation; error?: string }> {
  const { data: updatedReservation, error } = await supabase
    .from("official_reservations")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, reservation: updatedReservation };
}

export async function deleteReservation(
  id: number
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("official_reservations")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
