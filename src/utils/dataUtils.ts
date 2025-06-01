
import { Product, Category, Reservation } from "@/models/types";

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isValidUUID = (id: string): boolean => {
  return UUID_REGEX.test(id);
};

export const generateUUID = (): string => {
  return crypto.randomUUID();
};

// Function to migrate old numeric IDs to UUIDs
export const migrateDataToUUIDs = () => {
  console.log("Checking for data migration...");
  
  const storedProducts = localStorage.getItem("products");
  const storedCategories = localStorage.getItem("categories");
  const storedReservations = localStorage.getItem("reservations");
  
  let migrationNeeded = false;
  
  // Check if migration is needed
  if (storedProducts) {
    const products: Product[] = JSON.parse(storedProducts);
    if (products.some(p => !isValidUUID(p.id))) {
      migrationNeeded = true;
    }
  }
  
  if (storedCategories) {
    const categories: Category[] = JSON.parse(storedCategories);
    if (categories.some(c => !isValidUUID(c.id))) {
      migrationNeeded = true;
    }
  }
  
  if (storedReservations) {
    const reservations: Reservation[] = JSON.parse(storedReservations);
    if (reservations.some(r => !isValidUUID(r.id))) {
      migrationNeeded = true;
    }
  }
  
  if (migrationNeeded) {
    console.log("Data migration needed - clearing old data");
    localStorage.removeItem("products");
    localStorage.removeItem("categories");
    localStorage.removeItem("reservations");
    localStorage.removeItem("settings");
    return true;
  }
  
  return false;
};

export const validateEntityId = (id: string, entityType: string): boolean => {
  if (!isValidUUID(id)) {
    console.error(`Invalid ${entityType} ID format: ${id}`);
    return false;
  }
  return true;
};

export const logDataOperation = (operation: string, entityType: string, id: string) => {
  console.log(`${operation} ${entityType} with ID: ${id}`);
};
