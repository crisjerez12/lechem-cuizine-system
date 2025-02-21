import { z } from "zod";

export interface Reservation {
  id: number;
  name: string;
  mobile_number: string;
  location: string;
  notes: string;
  choices: string;
  package: string;
  pax: number;
  reservation_date: string;
  total_price: number;
  type?: string;
  created_at: string;
}
export const reservationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  mobile_number: z.string(),
  location: z.string().min(1, "Location is required"),
  package: z.string().optional(),
  notes: z.string().optional(),
  choices: z.string().optional(),
  pax: z.number().int().positive("Number of guests must be positive"),
  reservation_date: z.string().min(1, "Date is required"),
  total_price: z.number().nonnegative("Amount must be non-negative"),
  type: z.string().optional(),
});

export type ReservationForm = z.infer<typeof reservationSchema>;
