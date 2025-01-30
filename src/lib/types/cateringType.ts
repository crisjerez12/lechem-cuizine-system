export interface CateringItem {
  id?: number;
  image: string;
  title: string;
  description: string;
  attributes: string[];
  foods: string[];
  desserts: string[];
  price: number;
  min_price: number;
}
