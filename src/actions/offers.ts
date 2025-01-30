"use server";

interface CateringItem {
  id: string;
  title: string;
  description: string;
  standardPrice: number;
  minimumPrice: number;
  category: string;
  imageUrl: string;
  attributes: string[];
  isFeatured: boolean;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

let cateringItems: CateringItem[] = [
  {
    id: "1",
    title: "Wedding Package",
    description: "Complete catering service for weddings",
    standardPrice: 8000,
    minimumPrice: 5000,
    category: "Any Occasion",
    imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop",
    attributes: ["100 pax", "5-course meal", "Full service"],
    isFeatured: true
  }
];

let menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Adobo",
    price: 800,
    imageUrl: "https://images.unsplash.com/photo-1542365887-1149961dccc7?w=800&auto=format&fit=crop"
  }
];

export async function getOffers() {
  return { cateringItems, menuItems };
}

export async function addCateringItem(data: Omit<CateringItem, "id">) {
  const newItem = { ...data, id: Math.random().toString(36).substr(2, 9) };
  cateringItems.push(newItem);
  return { success: true, item: newItem };
}

export async function updateCateringItem(id: string, data: Partial<CateringItem>) {
  const index = cateringItems.findIndex(item => item.id === id);
  if (index !== -1) {
    cateringItems[index] = { ...cateringItems[index], ...data };
    return { success: true, item: cateringItems[index] };
  }
  return { success: false, error: "Item not found" };
}

export async function deleteCateringItem(id: string) {
  cateringItems = cateringItems.filter(item => item.id !== id);
  return { success: true };
}

export async function addMenuItem(data: Omit<MenuItem, "id">) {
  const newItem = { ...data, id: Math.random().toString(36).substr(2, 9) };
  menuItems.push(newItem);
  return { success: true, item: newItem };
}

export async function updateMenuItem(id: string, data: Partial<MenuItem>) {
  const index = menuItems.findIndex(item => item.id === id);
  if (index !== -1) {
    menuItems[index] = { ...menuItems[index], ...data };
    return { success: true, item: menuItems[index] };
  }
  return { success: false, error: "Item not found" };
}

export async function deleteMenuItem(id: string) {
  menuItems = menuItems.filter(item => item.id !== id);
  return { success: true };
}