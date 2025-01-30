"use server";

import supabase from "@/lib/supabase";
import { Reservation } from "@/lib/types/reservationType";

export async function getOnlineReservations() {
  const { data, error } = await supabase
    .from("online_reservations")
    .select("*");
  if (error)
    return {
      success: false,
      error,
      data: [],
    };
  return {
    success: true,
    error: null,
    data,
  };
}

export async function addToReservations(reservationInfo: Reservation | null) {
  const reservationData = { type: "online", ...reservationInfo };
  const { id, ...data } = { id: 1, ...reservationData };
  const { error } = await supabase
    .from("official_reservations")
    .insert([{ ...data }]);
  if (error) return { success: false };
  await supabase.from("online_reservations").delete().eq("id", id);
  return { success: true };
}

export async function deleteOnlineReservation(reservationId: number) {
  const { error } = await supabase
    .from("online_reservations")
    .delete()
    .eq("id", reservationId);
  if (error)
    return {
      success: false,
      error,
    };
  return { success: true, error: null };
}

export async function deleteLapsedReservations() {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedYesterday = yesterday.toISOString().split("T")[0];

    const { error } = await supabase
      .from("online_reservations")
      .delete()
      .lt("reservation_date", formattedYesterday);

    if (error) {
      throw error;
    }

    const { data: updatedReservations, error: fetchError } = await supabase
      .from("online_reservations")
      .select("*")
      .gte("reservation_date", formattedYesterday); // Get only valid reservations
    if (fetchError) {
      throw fetchError;
    }
    return {
      success: true,
      data: updatedReservations,
      error: null,
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        success: false,
        data: null,
        error: err,
      };
    }
  }
}
