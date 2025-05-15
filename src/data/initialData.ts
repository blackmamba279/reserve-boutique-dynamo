
import { Category, Product, Reservation, Settings, SalesReport, CustomerReport } from "../models/types";

// Mock categories
export const categories: Category[] = [
  { id: "1", name: "Dresses", code: "DRS" },
  { id: "2", name: "Tops", code: "TOP" },
  { id: "3", name: "Bottoms", code: "BTM" },
  { id: "4", name: "Accessories", code: "ACC" },
];

// Function to generate reference code
export const generateReference = (categoryCode: string): string => {
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${categoryCode}${year}-${random}`;
};

// Mock products
export const products: Product[] = [
  {
    id: "1",
    reference: "DRS23-0001",
    name: "Elegant Evening Dress",
    price: 2500,
    description: "A beautiful evening dress perfect for special occasions. Made with high-quality fabric that ensures comfort and elegance.",
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1612336307429-8a898d10e223?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    ],
    categoryId: "1",
    status: "available",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    reference: "TOP23-0002",
    name: "Summer Blouse",
    price: 850,
    description: "Light and breathable summer blouse. Perfect for casual outings and warm weather.",
    images: [
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1553545204-4f7d339aa06a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    ],
    categoryId: "2",
    status: "available",
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    reference: "BTM23-0003",
    name: "Classic Jeans",
    price: 1200,
    description: "High-quality denim jeans with a classic fit. Durable and comfortable for everyday wear.",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1604176424472-e519b08cb117?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    ],
    categoryId: "3",
    status: "reserved",
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    reference: "ACC23-0004",
    name: "Statement Necklace",
    price: 650,
    description: "Eye-catching statement necklace that adds a unique touch to any outfit. Handcrafted with attention to detail.",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1631982690223-8c4b46984123?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    ],
    categoryId: "4",
    status: "sold",
    createdAt: new Date().toISOString()
  }
];

// Mock reservations
export const reservations: Reservation[] = [
  {
    id: "1",
    productId: "3",
    customerName: "Maria Gonzalez",
    customerPhone: "+50587654321",
    status: "pending",
    reservationDate: new Date().toISOString()
  }
];

// Default settings
export const defaultSettings: Settings = {
  storeName: "BOUTIQUEMG RESERVED",
  logoUrl: "/logo.png",
  slogan: "Style That Lasts",
  whatsappNumber: "+50587010851",
  exchangeRate: 36.5 // 1 USD = 36.5 córdobas
};

// Mock sales data
export const salesReportData: SalesReport = {
  daily: [
    { period: "2023-05-01", totalSales: 2500, count: 2 },
    { period: "2023-05-02", totalSales: 3500, count: 3 },
    { period: "2023-05-03", totalSales: 1500, count: 1 },
  ],
  weekly: [
    { period: "2023-W18", totalSales: 15000, count: 12 },
    { period: "2023-W19", totalSales: 18500, count: 14 },
    { period: "2023-W20", totalSales: 12500, count: 10 },
  ],
  monthly: [
    { period: "2023-03", totalSales: 65000, count: 52 },
    { period: "2023-04", totalSales: 72000, count: 58 },
    { period: "2023-05", totalSales: 45000, count: 36 },
  ],
  yearly: [
    { period: "2022", totalSales: 850000, count: 680 },
    { period: "2023", totalSales: 320000, count: 256 },
  ]
};

// Mock customer report data
export const customerReportData: CustomerReport = {
  totalCustomers: 450,
  newCustomers: 35,
  returningCustomers: 15,
  topProducts: [
    { productId: "1", productName: "Elegant Evening Dress", count: 28 },
    { productId: "2", productName: "Summer Blouse", count: 22 },
    { productId: "3", productName: "Classic Jeans", count: 18 },
  ]
};
