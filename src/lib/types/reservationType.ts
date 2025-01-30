export interface Reservation {
  id: number;
  name: string;
  mobile_number: string;
  location: string;
  notes: string;
  package: string;
  pax: number;
  reservation_date: string;
  total_price: number;
  type?: string;
  created_at: string;
}
