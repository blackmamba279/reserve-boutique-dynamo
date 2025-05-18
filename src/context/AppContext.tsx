import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product, Category, Reservation, Settings, CustomerReport, SalesReport } from "../models/types";
import { products as initialProducts, categories as initialCategories, reservations as initialReservations, defaultSettings, salesReportData, customerReportData, generateReference } from "../data/initialData";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

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
  const { user, session } = useAuth();
  
  // Initial data load from Supabase when authenticated
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          await fetchProductsFromSupabase();
          await fetchCategoriesFromSupabase();
          await fetchReservationsFromSupabase();
          await fetchSettingsFromSupabase();
        } catch (error) {
          console.error("Error loading data from Supabase:", error);
          // Fall back to localStorage if Supabase fails
          loadDataFromLocalStorage();
        }
      } else {
        // If not authenticated, load from localStorage as fallback
        loadDataFromLocalStorage();
      }
    };
    
    loadData();
  }, [user]);
  
  const loadDataFromLocalStorage = () => {
    // Load from local storage on initial load
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
  };
  
  // Fetch functions from Supabase
  const fetchProductsFromSupabase = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) throw error;
    if (data && data.length > 0) {
      const mappedProducts: Product[] = data.map(item => ({
        id: item.id,
        reference: item.reference,
        name: item.name,
        price: Number(item.price),
        description: item.description,
        images: item.images,
        categoryId: item.category_id,
        status: item.status as 'available' | 'reserved' | 'sold',
        createdAt: item.created_at
      }));
      setProducts(mappedProducts);
    }
  };
  
  const fetchCategoriesFromSupabase = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    
    if (error) throw error;
    if (data && data.length > 0) {
      const mappedCategories: Category[] = data.map(item => ({
        id: item.id,
        name: item.name,
        code: item.code
      }));
      setCategories(mappedCategories);
    }
  };
  
  const fetchReservationsFromSupabase = async () => {
    const { data, error } = await supabase
      .from('reservations')
      .select('*');
    
    if (error) throw error;
    if (data && data.length > 0) {
      const mappedReservations: Reservation[] = data.map(item => ({
        id: item.id,
        productId: item.product_id,
        customerName: item.customer_name,
        customerPhone: item.customer_phone,
        status: item.status as 'pending' | 'completed' | 'cancelled',
        reservationDate: item.reservation_date
      }));
      setReservations(mappedReservations);
    }
  };
  
  const fetchSettingsFromSupabase = async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 means no rows returned
    if (data) {
      const mappedSettings: Settings = {
        storeName: data.store_name,
        logoUrl: data.logo_url,
        slogan: data.slogan,
        whatsappNumber: data.whatsapp_number,
        exchangeRate: Number(data.exchange_rate)
      };
      setSettings(mappedSettings);
    }
  };

  // Save to local storage when data changes (as fallback)
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

  // Product operations
  const addProduct = async (product: Omit<Product, "id" | "reference" | "createdAt">) => {
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
    
    if (user) {
      try {
        // Store in Supabase - map to the database schema
        const { error } = await supabase
          .from('products')
          .insert({
            id: newProduct.id,
            reference: newProduct.reference,
            name: newProduct.name,
            price: newProduct.price,
            description: newProduct.description,
            images: newProduct.images,
            category_id: newProduct.categoryId,
            status: newProduct.status,
            created_at: newProduct.createdAt
          });
        
        if (error) throw error;
        toast.success("Product added successfully to database");
      } catch (error) {
        console.error("Error adding product to Supabase:", error);
        toast.error("Failed to save product to database");
      }
    }
    
    // Update local state
    setProducts(current => [...current, newProduct]);
    toast.success("Product added successfully");
  };

  const updateProduct = async (productId: string, data: Partial<Product>) => {
    if (user) {
      try {
        // Map the data to match database schema
        const dbData: any = {};
        if (data.name) dbData.name = data.name;
        if (data.price !== undefined) dbData.price = data.price;
        if (data.description) dbData.description = data.description;
        if (data.images) dbData.images = data.images;
        if (data.categoryId) dbData.category_id = data.categoryId;
        if (data.status) dbData.status = data.status;
        
        // Update in Supabase
        const { error } = await supabase
          .from('products')
          .update(dbData)
          .eq('id', productId);
        
        if (error) throw error;
        toast.success("Product updated successfully in database");
      } catch (error) {
        console.error("Error updating product in Supabase:", error);
        toast.error("Failed to update product in database");
      }
    }
    
    // Update local state
    setProducts(current =>
      current.map(product => 
        product.id === productId ? { ...product, ...data } : product
      )
    );
    toast.success("Product updated successfully");
  };

  const deleteProduct = async (productId: string) => {
    // Check if product has reservations
    const hasReservation = reservations.some(r => r.productId === productId && r.status === 'pending');
    
    if (hasReservation) {
      toast.error("Cannot delete product with pending reservation");
      return;
    }
    
    if (user) {
      try {
        // Delete from Supabase
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);
        
        if (error) throw error;
        toast.success("Product deleted successfully from database");
      } catch (error) {
        console.error("Error deleting product from Supabase:", error);
        toast.error("Failed to delete product from database");
      }
    }
    
    // Update local state
    setProducts(current => current.filter(p => p.id !== productId));
    toast.success("Product deleted successfully");
  };

  // Category operations
  const addCategory = async (category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString()
    };
    
    if (user) {
      try {
        // Store in Supabase
        const { error } = await supabase
          .from('categories')
          .insert({
            id: newCategory.id,
            name: newCategory.name,
            code: newCategory.code
          });
        
        if (error) throw error;
        toast.success("Category added successfully to database");
      } catch (error) {
        console.error("Error adding category to Supabase:", error);
        toast.error("Failed to save category to database");
      }
    }
    
    // Update local state
    setCategories(current => [...current, newCategory]);
    toast.success("Category added successfully");
  };

  const updateCategory = async (categoryId: string, data: Partial<Category>) => {
    if (user) {
      try {
        // Update in Supabase
        const { error } = await supabase
          .from('categories')
          .update({
            name: data.name,
            code: data.code
          })
          .eq('id', categoryId);
        
        if (error) throw error;
        toast.success("Category updated successfully in database");
      } catch (error) {
        console.error("Error updating category in Supabase:", error);
        toast.error("Failed to update category in database");
      }
    }
    
    // Update local state
    setCategories(current =>
      current.map(category => 
        category.id === categoryId ? { ...category, ...data } : category
      )
    );
    toast.success("Category updated successfully");
  };

  const deleteCategory = async (categoryId: string) => {
    // Check if any products use this category
    const hasProducts = products.some(p => p.categoryId === categoryId);
    
    if (hasProducts) {
      toast.error("Cannot delete category that has products");
      return;
    }
    
    if (user) {
      try {
        // Delete from Supabase
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', categoryId);
        
        if (error) throw error;
        toast.success("Category deleted successfully from database");
      } catch (error) {
        console.error("Error deleting category from Supabase:", error);
        toast.error("Failed to delete category from database");
      }
    }
    
    // Update local state
    setCategories(current => current.filter(c => c.id !== categoryId));
    toast.success("Category deleted successfully");
  };

  // Reservation operations
  const reserveProduct = async (productId: string, customerName: string, customerPhone: string) => {
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
    
    if (user) {
      try {
        // Store in Supabase
        const { error } = await supabase
          .from('reservations')
          .insert({
            id: newReservation.id,
            product_id: newReservation.productId,
            customer_name: newReservation.customerName,
            customer_phone: newReservation.customerPhone,
            status: newReservation.status,
            reservation_date: newReservation.reservationDate
          });
        
        if (error) throw error;
        toast.success("Reservation added successfully to database");
        
        // Update product status in Supabase
        await updateProduct(productId, { status: 'reserved' });
      } catch (error) {
        console.error("Error adding reservation to Supabase:", error);
        toast.error("Failed to save reservation to database");
      }
    } else {
      // Update local state for reservations
      setReservations(current => [...current, newReservation]);
      
      // Update product status
      updateProduct(productId, { status: 'reserved' });
    }
    
    toast.success("Product reserved successfully");
  };

  const completeReservation = async (reservationId: string) => {
    const reservation = reservations.find(r => r.id === reservationId);
    
    if (!reservation) {
      toast.error("Reservation not found");
      return;
    }
    
    if (user) {
      try {
        // Update reservation status in Supabase
        const { error } = await supabase
          .from('reservations')
          .update({ status: 'completed' })
          .eq('id', reservationId);
        
        if (error) throw error;
        
        // Update product status in Supabase
        await updateProduct(reservation.productId, { status: 'sold' });
        
        toast.success("Reservation completed successfully in database");
      } catch (error) {
        console.error("Error completing reservation in Supabase:", error);
        toast.error("Failed to complete reservation in database");
      }
    }
    
    // Update local state
    setReservations(current =>
      current.map(r => 
        r.id === reservationId ? { ...r, status: 'completed' } : r
      )
    );
    
    // Update product status to sold
    updateProduct(reservation.productId, { status: 'sold' });
    
    toast.success("Reservation completed successfully");
  };

  const cancelReservation = async (reservationId: string) => {
    const reservation = reservations.find(r => r.id === reservationId);
    
    if (!reservation) {
      toast.error("Reservation not found");
      return;
    }
    
    if (user) {
      try {
        // Update reservation status in Supabase
        const { error } = await supabase
          .from('reservations')
          .update({ status: 'cancelled' })
          .eq('id', reservationId);
        
        if (error) throw error;
        
        // Update product status in Supabase
        await updateProduct(reservation.productId, { status: 'available' });
        
        toast.success("Reservation cancelled successfully in database");
      } catch (error) {
        console.error("Error cancelling reservation in Supabase:", error);
        toast.error("Failed to cancel reservation in database");
      }
    }
    
    // Update local state
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
  const updateSettings = async (data: Partial<Settings>) => {
    if (user) {
      try {
        // Prepare data for Supabase (convert to snake_case)
        const settingsData = {
          store_name: data.storeName || settings.storeName,
          logo_url: data.logoUrl || settings.logoUrl,
          slogan: data.slogan || settings.slogan,
          whatsapp_number: data.whatsappNumber || settings.whatsappNumber,
          exchange_rate: data.exchangeRate || settings.exchangeRate
        };
        
        // Check if settings exist in Supabase
        const { data: existingSettings, error: fetchError } = await supabase
          .from('settings')
          .select('*');
        
        if (fetchError) throw fetchError;
        
        if (existingSettings && existingSettings.length > 0) {
          // Update existing settings
          const { error } = await supabase
            .from('settings')
            .update(settingsData)
            .eq('id', existingSettings[0].id);
          
          if (error) throw error;
        } else {
          // Insert new settings
          const { error } = await supabase
            .from('settings')
            .insert(settingsData);
          
          if (error) throw error;
        }
        
        toast.success("Settings updated successfully in database");
      } catch (error) {
        console.error("Error updating settings in Supabase:", error);
        toast.error("Failed to update settings in database");
      }
    }
    
    // Update local state
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
