
import { Category, Product, Reservation, Settings, SalesReport, CustomerReport } from "../models/types";

// Production categories - essential clothing categories
export const categories: Category[] = [
  { id: "550e8400-e29b-41d4-a716-446655440001", name: "Dresses", code: "DRS" },
  { id: "550e8400-e29b-41d4-a716-446655440002", name: "Tops", code: "TOP" },
  { id: "550e8400-e29b-41d4-a716-446655440003", name: "Bottoms", code: "BTM" },
  { id: "550e8400-e29b-41d4-a716-446655440004", name: "Accessories", code: "ACC" },
];

// Function to generate reference code
export const generateReference = (categoryCode: string): string => {
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${categoryCode}${year}-${random}`;
};

// Production app starts with empty products - users will add their own
export const products: Product[] = [];

// Production app starts with no reservations
export const reservations: Reservation[] = [];

// Production default settings - customize for your store
export const defaultSettings: Settings = {
  storeName: "My Boutique Store",
  logoUrl: "/logo.png",
  slogan: "Style That Lasts",
  whatsappNumber: "+1234567890", // Update with your WhatsApp number
  exchangeRate: 1.0 // Update with your local currency rate
};

// Production sales data starts empty
export const salesReportData: SalesReport = {
  daily: [],
  weekly: [],
  monthly: [],
  yearly: []
};

// Production customer report starts empty
export const customerReportData: CustomerReport = {
  totalCustomers: 0,
  newCustomers: 0,
  returningCustomers: 0,
  topProducts: []
};
