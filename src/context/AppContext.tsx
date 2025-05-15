
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product, Category, Reservation, Settings, CustomerReport, SalesReport } from "../models/types";
import { products as initialProducts, categories as initialCategories, reservations as initialReservations, defaultSettings, salesReportData, customerReportData, generateReference } from "../data/initialData";
import { toast } from "@/components/ui/sonner";

interface AppContextType {
  products: Product[];
  categories: Category[];
  reservations: Reservation[];
  settings: Settings;
  salesReport: SalesReport;
  customerReport: CustomerReport;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  addProduct: (product: Omit<Product, "id" | "reference" | "createdAt">) => void;
  updateProduct: (productId: string, data: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (categoryId: string, data: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;
  reserveProduct: (productId: string, customerName: string, customerPhone: string) => void;
  completeReservation: (reservationId: string) => void;
  cancelReservation: (reservationId: string) => void;
  updateSettings: (data: Partial<Settings>) => void;
  getProductByReference: (reference: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  getCategoryById: (id: string) => Category | undefined;
  getReservationById: (id: string) => Reservation | undefined;
  getReservationByProductId: (productId: string) => Reservation | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [salesReport] = useState<SalesReport>(salesReportData);
  const [customerReport] = useState<CustomerReport>(customerReportData);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Save to local storage when data changes
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("reservations", JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  // Load from local storage on initial load
  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }

    const storedCategories = localStorage.getItem("categories");
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }

    const storedReservations = localStorage.getItem("reservations");
    if (storedReservations) {
      setReservations(JSON.parse(storedReservations));
    }

    const storedSettings = localStorage.getItem("settings");
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  // Product operations
  const addProduct = (product: Omit<Product, "id" | "reference" | "createdAt">) => {
    const category = categories.find(c => c.id === product.categoryId);
    if (!category) {
      toast.error("Category not found");
      return;
    }
    
    const reference = generateReference(category.code);
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      reference,
      createdAt: new Date().toISOString()
    };
    
    setProducts(current => [...current, newProduct]);
    toast.success("Product added successfully");
  };

  const updateProduct = (productId: string, data: Partial<Product>) => {
    setProducts(current =>
      current.map(product => 
        product.id === productId ? { ...product, ...data } : product
      )
    );
    toast.success("Product updated successfully");
  };

  const deleteProduct = (productId: string) => {
    // Check if product has reservations
    const hasReservation = reservations.some(r => r.productId === productId && r.status === 'pending');
    
    if (hasReservation) {
      toast.error("Cannot delete product with pending reservation");
      return;
    }
    
    setProducts(current => current.filter(p => p.id !== productId));
    toast.success("Product deleted successfully");
  };

  // Category operations
  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString()
    };
    
    setCategories(current => [...current, newCategory]);
    toast.success("Category added successfully");
  };

  const updateCategory = (categoryId: string, data: Partial<Category>) => {
    setCategories(current =>
      current.map(category => 
        category.id === categoryId ? { ...category, ...data } : category
      )
    );
    toast.success("Category updated successfully");
  };

  const deleteCategory = (categoryId: string) => {
    // Check if any products use this category
    const hasProducts = products.some(p => p.categoryId === categoryId);
    
    if (hasProducts) {
      toast.error("Cannot delete category that has products");
      return;
    }
    
    setCategories(current => current.filter(c => c.id !== categoryId));
    toast.success("Category deleted successfully");
  };

  // Reservation operations
  const reserveProduct = (productId: string, customerName: string, customerPhone: string) => {
    // Check if product exists and is available
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      toast.error("Product not found");
      return;
    }
    
    if (product.status !== 'available') {
      toast.error("Product is not available for reservation");
      return;
    }
    
    // Create reservation
    const newReservation: Reservation = {
      id: Date.now().toString(),
      productId,
      customerName,
      customerPhone,
      status: 'pending',
      reservationDate: new Date().toISOString()
    };
    
    setReservations(current => [...current, newReservation]);
    
    // Update product status
    updateProduct(productId, { status: 'reserved' });
    
    toast.success("Product reserved successfully");
  };

  const completeReservation = (reservationId: string) => {
    const reservation = reservations.find(r => r.id === reservationId);
    
    if (!reservation) {
      toast.error("Reservation not found");
      return;
    }
    
    // Update reservation status
    setReservations(current =>
      current.map(r => 
        r.id === reservationId ? { ...r, status: 'completed' } : r
      )
    );
    
    // Update product status to sold
    updateProduct(reservation.productId, { status: 'sold' });
    
    toast.success("Reservation completed successfully");
  };

  const cancelReservation = (reservationId: string) => {
    const reservation = reservations.find(r => r.id === reservationId);
    
    if (!reservation) {
      toast.error("Reservation not found");
      return;
    }
    
    // Update reservation status
    setReservations(current =>
      current.map(r => 
        r.id === reservationId ? { ...r, status: 'cancelled' } : r
      )
    );
    
    // Update product status back to available
    updateProduct(reservation.productId, { status: 'available' });
    
    toast.success("Reservation cancelled successfully");
  };

  // Settings operations
  const updateSettings = (data: Partial<Settings>) => {
    setSettings(current => ({ ...current, ...data }));
    toast.success("Settings updated successfully");
  };

  // Helper methods
  const getProductByReference = (reference: string) => {
    return products.find(p => p.reference === reference);
  };

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  const getCategoryById = (id: string) => {
    return categories.find(c => c.id === id);
  };

  const getReservationById = (id: string) => {
    return reservations.find(r => r.id === id);
  };

  const getReservationByProductId = (productId: string) => {
    return reservations.find(r => r.productId === productId && r.status === 'pending');
  };

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        reservations,
        settings,
        salesReport,
        customerReport,
        isAuthenticated,
        setIsAuthenticated,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        reserveProduct,
        completeReservation,
        cancelReservation,
        updateSettings,
        getProductByReference,
        getProductById,
        getCategoryById,
        getReservationById,
        getReservationByProductId
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
