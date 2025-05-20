
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
  const [loading, setLoading] = useState<boolean>(true);
  const { user, session } = useAuth();
  
  // Initial data load from Supabase when component mounts
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchProductsFromSupabase(),
          fetchCategoriesFromSupabase(),
          fetchReservationsFromSupabase(),
          fetchSettingsFromSupabase()
        ]);
        console.log("Data loaded from Supabase successfully");
      } catch (error) {
        console.error("Error loading data from Supabase:", error);
        toast.error("Failed to load data from server, using local data");
        // Fall back to localStorage if Supabase fails
        loadDataFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user]); // Re-fetch when user authentication changes
  
  const loadDataFromLocalStorage = () => {
    // Load from local storage as fallback
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
    
    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
    
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
      
      console.log(`Fetched ${mappedProducts.length} products from Supabase`);
      setProducts(mappedProducts);
    } else {
      console.log("No products found in Supabase, using initial data");
    }
  };
  
  const fetchCategoriesFromSupabase = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    
    if (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
    
    if (data && data.length > 0) {
      const mappedCategories: Category[] = data.map(item => ({
        id: item.id,
        name: item.name,
        code: item.code
      }));
      
      console.log(`Fetched ${mappedCategories.length} categories from Supabase`);
      setCategories(mappedCategories);
    } else {
      console.log("No categories found in Supabase, using initial data");
    }
  };
  
  const fetchReservationsFromSupabase = async () => {
    const { data, error } = await supabase
      .from('reservations')
      .select('*');
    
    if (error) {
      console.error("Error fetching reservations:", error);
      throw error;
    }
    
    if (data && data.length > 0) {
      const mappedReservations: Reservation[] = data.map(item => ({
        id: item.id,
        productId: item.product_id,
        customerName: item.customer_name,
        customerPhone: item.customer_phone,
        status: item.status as 'pending' | 'completed' | 'cancelled',
        reservationDate: item.reservation_date
      }));
      
      console.log(`Fetched ${mappedReservations.length} reservations from Supabase`);
      setReservations(mappedReservations);
    } else {
      console.log("No reservations found in Supabase, using initial data");
    }
  };
  
  const fetchSettingsFromSupabase = async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('*');
    
    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching settings:", error);
      throw error;
    }
    
    if (data && data.length > 0) {
      const item = data[0];
      const mappedSettings: Settings = {
        storeName: item.store_name,
        logoUrl: item.logo_url,
        slogan: item.slogan,
        whatsappNumber: item.whatsapp_number,
        exchangeRate: Number(item.exchange_rate)
      };
      
      console.log("Fetched settings from Supabase");
      setSettings(mappedSettings);
    } else {
      console.log("No settings found in Supabase, using default settings");
      // Add default settings to Supabase if none exist
      if (user) {
        const { error } = await supabase
          .from('settings')
          .insert({
            store_name: defaultSettings.storeName,
            logo_url: defaultSettings.logoUrl,
            slogan: defaultSettings.slogan,
            whatsapp_number: defaultSettings.whatsappNumber,
            exchange_rate: defaultSettings.exchangeRate
          });
        
        if (error) {
          console.error("Error creating default settings:", error);
        } else {
          console.log("Created default settings in Supabase");
        }
      }
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
      id: crypto.randomUUID(),
      reference,
      createdAt: new Date().toISOString()
    };
    
    try {
      // Store in Supabase - map to the database schema
      const { data, error } = await supabase
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
        })
        .select();
      
      if (error) {
        console.error("Error adding product to Supabase:", error);
        toast.error("Failed to save product to database");
        throw error;
      }
      
      // Update local state
      setProducts(current => [...current, newProduct]);
      toast.success("Product added successfully");
    } catch (error) {
      console.error("Error in addProduct:", error);
      toast.error("Failed to add product");
    }
  };

  const updateProduct = async (productId: string, data: Partial<Product>) => {
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
      
      if (error) {
        console.error("Error updating product in Supabase:", error);
        toast.error("Failed to update product in database");
        throw error;
      }
      
      // Update local state
      setProducts(current =>
        current.map(product => 
          product.id === productId ? { ...product, ...data } : product
        )
      );
      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Error in updateProduct:", error);
      toast.error("Failed to update product");
    }
  };

  const deleteProduct = async (productId: string) => {
    // Check if product has reservations
    const hasReservation = reservations.some(r => r.productId === productId && r.status === 'pending');
    
    if (hasReservation) {
      toast.error("Cannot delete product with pending reservation");
      return;
    }
    
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) {
        console.error("Error deleting product from Supabase:", error);
        toast.error("Failed to delete product from database");
        throw error;
      }
      
      // Update local state
      setProducts(current => current.filter(p => p.id !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error in deleteProduct:", error);
      toast.error("Failed to delete product");
    }
  };

  // Category operations
  const addCategory = async (category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID()
    };
    
    try {
      // Store in Supabase
      const { error } = await supabase
        .from('categories')
        .insert({
          id: newCategory.id,
          name: newCategory.name,
          code: newCategory.code
        });
      
      if (error) {
        console.error("Error adding category to Supabase:", error);
        toast.error("Failed to save category to database");
        throw error;
      }
      
      // Update local state
      setCategories(current => [...current, newCategory]);
      toast.success("Category added successfully");
    } catch (error) {
      console.error("Error in addCategory:", error);
      toast.error("Failed to add category");
    }
  };

  const updateCategory = async (categoryId: string, data: Partial<Category>) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('categories')
        .update({
          name: data.name,
          code: data.code
        })
        .eq('id', categoryId);
      
      if (error) {
        console.error("Error updating category in Supabase:", error);
        toast.error("Failed to update category in database");
        throw error;
      }
      
      // Update local state
      setCategories(current =>
        current.map(category => 
          category.id === categoryId ? { ...category, ...data } : category
        )
      );
      toast.success("Category updated successfully");
    } catch (error) {
      console.error("Error in updateCategory:", error);
      toast.error("Failed to update category");
    }
  };

  const deleteCategory = async (categoryId: string) => {
    // Check if any products use this category
    const hasProducts = products.some(p => p.categoryId === categoryId);
    
    if (hasProducts) {
      toast.error("Cannot delete category that has products");
      return;
    }
    
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) {
        console.error("Error deleting category from Supabase:", error);
        toast.error("Failed to delete category from database");
        throw error;
      }
      
      // Update local state
      setCategories(current => current.filter(c => c.id !== categoryId));
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error in deleteCategory:", error);
      toast.error("Failed to delete category");
    }
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
      id: crypto.randomUUID(),
      productId,
      customerName,
      customerPhone,
      status: 'pending',
      reservationDate: new Date().toISOString()
    };
    
    try {
      // Store reservation in Supabase
      const { error: reservationError } = await supabase
        .from('reservations')
        .insert({
          id: newReservation.id,
          product_id: newReservation.productId,
          customer_name: newReservation.customerName,
          customer_phone: newReservation.customerPhone,
          status: newReservation.status,
          reservation_date: newReservation.reservationDate
        });
      
      if (reservationError) {
        console.error("Error adding reservation to Supabase:", reservationError);
        toast.error("Failed to save reservation to database");
        throw reservationError;
      }
      
      // Update product status in Supabase
      const { error: productError } = await supabase
        .from('products')
        .update({ status: 'reserved' })
        .eq('id', productId);
      
      if (productError) {
        console.error("Error updating product status in Supabase:", productError);
        toast.error("Failed to update product status in database");
        throw productError;
      }
      
      // Update local state for reservations
      setReservations(current => [...current, newReservation]);
      
      // Update product status in local state
      setProducts(current =>
        current.map(p => 
          p.id === productId ? { ...p, status: 'reserved' as const } : p
        )
      );
      
      toast.success("Product reserved successfully");
    } catch (error) {
      console.error("Error in reserveProduct:", error);
      toast.error("Failed to reserve product");
    }
  };

  const completeReservation = async (reservationId: string) => {
    const reservation = reservations.find(r => r.id === reservationId);
    
    if (!reservation) {
      toast.error("Reservation not found");
      return;
    }
    
    try {
      // Update reservation status in Supabase
      const { error: reservationError } = await supabase
        .from('reservations')
        .update({ status: 'completed' })
        .eq('id', reservationId);
      
      if (reservationError) {
        console.error("Error completing reservation in Supabase:", reservationError);
        toast.error("Failed to complete reservation in database");
        throw reservationError;
      }
      
      // Update product status in Supabase
      const { error: productError } = await supabase
        .from('products')
        .update({ status: 'sold' })
        .eq('id', reservation.productId);
      
      if (productError) {
        console.error("Error updating product status in Supabase:", productError);
        toast.error("Failed to update product status in database");
        throw productError;
      }
      
      // Update local state for reservations
      setReservations(current =>
        current.map(r => 
          r.id === reservationId ? { ...r, status: 'completed' as const } : r
        )
      );
      
      // Update product status to sold in local state
      setProducts(current =>
        current.map(p => 
          p.id === reservation.productId ? { ...p, status: 'sold' as const } : p
        )
      );
      
      toast.success("Reservation completed successfully");
    } catch (error) {
      console.error("Error in completeReservation:", error);
      toast.error("Failed to complete reservation");
    }
  };

  const cancelReservation = async (reservationId: string) => {
    const reservation = reservations.find(r => r.id === reservationId);
    
    if (!reservation) {
      toast.error("Reservation not found");
      return;
    }
    
    try {
      // Update reservation status in Supabase
      const { error: reservationError } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('id', reservationId);
      
      if (reservationError) {
        console.error("Error cancelling reservation in Supabase:", reservationError);
        toast.error("Failed to cancel reservation in database");
        throw reservationError;
      }
      
      // Update product status in Supabase
      const { error: productError } = await supabase
        .from('products')
        .update({ status: 'available' })
        .eq('id', reservation.productId);
      
      if (productError) {
        console.error("Error updating product status in Supabase:", productError);
        toast.error("Failed to update product status in database");
        throw productError;
      }
      
      // Update local state for reservations
      setReservations(current =>
        current.map(r => 
          r.id === reservationId ? { ...r, status: 'cancelled' as const } : r
        )
      );
      
      // Update product status back to available in local state
      setProducts(current =>
        current.map(p => 
          p.id === reservation.productId ? { ...p, status: 'available' as const } : p
        )
      );
      
      toast.success("Reservation cancelled successfully");
    } catch (error) {
      console.error("Error in cancelReservation:", error);
      toast.error("Failed to cancel reservation");
    }
  };

  // Settings operations
  const updateSettings = async (data: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...data };
    
    try {
      // Prepare data for Supabase (convert to snake_case)
      const settingsData = {
        store_name: updatedSettings.storeName,
        logo_url: updatedSettings.logoUrl,
        slogan: updatedSettings.slogan,
        whatsapp_number: updatedSettings.whatsappNumber,
        exchange_rate: updatedSettings.exchangeRate
      };
      
      // Check if settings exist in Supabase
      const { data: existingSettings, error: fetchError } = await supabase
        .from('settings')
        .select('id');
      
      if (fetchError) {
        console.error("Error fetching settings:", fetchError);
        throw fetchError;
      }
      
      if (existingSettings && existingSettings.length > 0) {
        // Update existing settings
        const { error } = await supabase
          .from('settings')
          .update(settingsData)
          .eq('id', existingSettings[0].id);
        
        if (error) {
          console.error("Error updating settings in Supabase:", error);
          toast.error("Failed to update settings in database");
          throw error;
        }
      } else {
        // Insert new settings
        const { error } = await supabase
          .from('settings')
          .insert(settingsData);
        
        if (error) {
          console.error("Error creating settings in Supabase:", error);
          toast.error("Failed to create settings in database");
          throw error;
        }
      }
      
      // Update local state
      setSettings(updatedSettings);
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error in updateSettings:", error);
      toast.error("Failed to update settings");
    }
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
