
export interface Product {
  id: string;
  reference: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  categoryId: string;
  status: 'available' | 'reserved' | 'sold';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  code: string;
}

export interface Reservation {
  id: string;
  productId: string;
  customerName: string;
  customerPhone: string;
  status: 'pending' | 'completed' | 'cancelled';
  reservationDate: string;
}

export interface User {
  username: string;
  password: string;
}

export interface Settings {
  storeName: string;
  logoUrl: string;
  slogan: string;
  whatsappNumber: string;
  exchangeRate: number;
}

export interface SalesReport {
  daily: SalesSummary[];
  weekly: SalesSummary[];
  monthly: SalesSummary[];
  yearly: SalesSummary[];
}

export interface SalesSummary {
  period: string;
  totalSales: number;
  count: number;
}

export interface CustomerReport {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  topProducts: {
    productId: string;
    productName: string;
    count: number;
  }[];
}
