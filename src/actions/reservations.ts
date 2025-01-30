"use server";

import supabase from "@/lib/supabase";

interface Reservation {
  reservationId: string;
  name: string;
  mobile: string;
  email: string;
  location: string;
  specifications: Record<string, string>;
  reservationDate: string;
  status: string;
  amountDue: number;
  createdAt: string;
}

let reservations: Reservation[] = [
  {
    reservationId: "123456",
    name: "John Doe",
    mobile: "+639123456789",
    email: "johndoe@example.com",
    location: "123 Event Avenue, City, State",
    specifications: {
      Rice: "2kg",
      Bacon: "5 pieces",
      Chicken: "3kg",
      Vegetables: "Assorted 1kg",
      Drinks: "10 bottles of soda",
    },
    reservationDate: "2025-01-10T15:30:00Z",
    status: "confirmed",
    amountDue: 500.0,
    createdAt: "2025-01-04T10:00:00Z",
  },
];

export async function getReservations() {
  const { data, error } = await supabase
    .from("official_reservations")
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

export async function addReservation(
  data: Omit<Reservation, "reservationId" | "createdAt" | "status">
) {
  const newReservation: Reservation = {
    ...data,
    reservationId: Math.random().toString(36).substr(2, 9),
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  reservations.push(newReservation);
  return { success: true, reservation: newReservation };
}

export async function updateReservation(
  reservationId: string,
  data: Partial<Reservation>
) {
  const index = reservations.findIndex(
    (r) => r.reservationId === reservationId
  );
  if (index !== -1) {
    reservations[index] = { ...reservations[index], ...data };
    return { success: true, reservation: reservations[index] };
  }
  return { success: false, error: "Reservation not found" };
}

export async function deleteReservation(reservationId: string) {
  reservations = reservations.filter((r) => r.reservationId !== reservationId);
  return { success: true };
}
