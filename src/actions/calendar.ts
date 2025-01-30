"use server";

interface Reservation {
  reservationId: string;
  name: string;
  time: string;
  amountDue: number;
}

interface DateStatus {
  date: string;
  isOpen: boolean;
  reservation: Reservation | null;
}

const dateStatuses: Record<string, DateStatus> = {};

export async function getCalendarData(month: string) {
  console.log(month);
  return dateStatuses;
}

export async function toggleReservationStatus(date: string, isOpen: boolean) {
  if (dateStatuses[date]) {
    dateStatuses[date].isOpen = isOpen;
    return { success: true };
  }
  return { success: false, error: "Date not found" };
}
