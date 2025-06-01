import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product, Category, Reservation, Settings, CustomerReport, SalesReport } from "../models/types";
import { products as initialProducts, categories as initialCategories, reservations as initialReservations, defaultSettings, salesReportData, customerReportData, generateReference } from "../data/initialData";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { isValidUUID, validateEntityId, logDataOperation, migrateDataToUUIDs } from "@/utils/dataUtils";

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
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [salesReport] = useState<SalesReport>(salesReportData);
  const [customerReport] = useState<CustomerReport>(customerReportData);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataInitialized, setDataInitialized] = useState<boolean>(false);
  const { user, session } = useAuth();
  
  // Check for data migration on component mount
  useEffect(() => {
    const migrated = migrateDataToUUIDs();
    if (migrated) {
      console.log("Data migration completed - using fresh data");
    }
  }, []);
  
  // Function to initialize production data in database
  const initializeProductionData = async () => {
    console.log("Initializing production data...");
    
    try {
      // Check if categories exist in database
      const { data: existingCategories, error: categoriesError } = await supabase
        .from('categories')
        .select('*');
      
      if (categoriesError) {
        console.error("Error checking categories:", categoriesError);
        return;
      }
      
      // If no categories exist, initialize with default categories
      if (!existingCategories || existingCategories.length === 0) {
        console.log("No categories found, initializing default categories...");
        
        for (const category of initialCategories) {
          const { error } = await supabase
            .from('categories')
            .insert({
              id: category.id,
              name: category.name,
              code: category.code
            });
          
          if (error) {
            console.error("Error inserting category:", error);
          } else {
            console.log(`Initialized category: ${category.name}`);
          }
        }
      }
      
      // Initialize default settings if none exist
      const { data: existingSettings, error: settingsError } = await supabase
        .from('settings')
        .select('*');
      
      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error("Error checking settings:", settingsError);
        return;
      }
      
      if (!existingSettings || existingSettings.length === 0) {
        console.log("No settings found, initializing default settings...");
        
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
          console.error("Error inserting settings:", error);
        } else {
          console.log("Initialized default settings");
        }
      }
      
      setDataInitialized(true);
      console.log("Production data initialization completed");
    } catch (error) {
      console.error("Error initializing production data:", error);
    }
  };
  
  // Function to refresh all data
  const refreshData = async () => {
    console.log("Refreshing data from database...");
    try {
      await Promise.all([
        fetchProductsFromSupabase(),
        fetchCategoriesFromSupabase(),
        fetchReservationsFromSupabase(),
        fetchSettingsFromSupabase()
      ]);
      console.log("Data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  // Initial data load from Supabase when component mounts
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Initialize production data first if needed
        if (user && !dataInitialized) {
          await initializeProductionData();
        }
        
        await refreshData();
      } catch (error) {
        console.error("Error loading data from Supabase:", error);
        toast.error("Failed to load data from server");
        // In production, we don't fall back to local storage demo data
        setCategories(initialCategories);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      loadData();
    } else {
      // If no user, just load initial categories for display
      setCategories(initialCategories);
      setLoading(false);
    }
  }, [user, dataInitialized]);

  // Set up real-time subscriptions for database changes
  useEffect(() => {
    if (!user) return;
    
    console.log("Setting up real-time subscriptions...");
    
    const productsChannel = supabase
      .channel('products-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'products'
      }, (payload) => {
        console.log('Products table changed:', payload);
        fetchProductsFromSupabase();
      })
      .subscribe();

    const reservationsChannel = supabase
      .channel('reservations-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reservations'
      }, (payload) => {
        console.log('Reservations table changed:', payload);
        fetchReservationsFromSupabase();
      })
      .subscribe();

    const categoriesChannel = supabase
      .channel('categories-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'categories'
      }, (payload) => {
        console.log('Categories table changed:', payload);
        fetchCategoriesFromSupabase();
      })
      .subscribe();

    return () => {
      console.log("Cleaning up real-time subscriptions...");
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(reservationsChannel);
      supabase.removeChannel(categoriesChannel);
    };
  }, [user]);
  
  // Fetch functions from Supabase
  const fetchProductsFromSupabase = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
    
    if (data) {
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
    
    if (data) {
      const mappedCategories: Category[] = data.map(item => ({
        id: item.id,
        name: item.name,
        code: item.code
      }));
      
      console.log(`Fetched ${mappedCategories.length} categories from Supabase`);
      setCategories(mappedCategories);
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
    
    if (data) {
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
    }
  };

  // Remove local storage dependencies for production
  // All data now comes from Supabase database

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
      
      setProducts(current => [...current, newProduct]);
      toast.success("Product added successfully");
    } catch (error) {
      console.error("Error in addProduct:", error);
      toast.error("Failed to add product");
    }
  };

  const updateProduct = async (productId: string, data: Partial<Product>) => {
    if (!validateEntityId(productId, "product")) {
      toast.error("Invalid product ID format");
      return;
    }

    try {
      logDataOperation("Updating", "product", productId);
      
      const dbData: any = {};
      if (data.name) dbData.name = data.name;
      if (data.price !== undefined) dbData.price = data.price;
      if (data.description) dbData.description = data.description;
      if (data.images) dbData.images = data.images;
      if (data.categoryId) dbData.category_id = data.categoryId;
      if (data.status) dbData.status = data.status;
      
      const { error } = await supabase
        .from('products')
        .update(dbData)
        .eq('id', productId);
      
      if (error) {
        console.error("Error updating product in Supabase:", error);
        toast.error("Failed to update product in database");
        throw error;
      }
      
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
    if (!validateEntityId(productId, "product")) {
      toast.error("Invalid product ID format");
      return;
    }

    const hasReservation = reservations.some(r => r.productId === productId && r.status === 'pending');
    
    if (hasReservation) {
      toast.error("Cannot delete product with pending reservation");
      return;
    }
    
    try {
      logDataOperation("Deleting", "product", productId);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) {
        console.error("Error deleting product from Supabase:", error);
        toast.error("Failed to delete product from database");
        throw error;
      }
      
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
      
      setCategories(current => [...current, newCategory]);
      toast.success("Category added successfully");
    } catch (error) {
      console.error("Error in addCategory:", error);
      toast.error("Failed to add category");
    }
  };

  const updateCategory = async (categoryId: string, data: Partial<Category>) => {
    if (!validateEntityId(categoryId, "category")) {
      toast.error("Invalid category ID format");
      return;
    }

    try {
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
    if (!validateEntityId(categoryId, "category")) {
      toast.error("Invalid category ID format");
      return;
    }

    const hasProducts = products.some(p => p.categoryId === categoryId);
    
    if (hasProducts) {
      toast.error("Cannot delete category that has products");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) {
        console.error("Error deleting category from Supabase:", error);
        toast.error("Failed to delete category from database");
        throw error;
      }
      
      setCategories(current => current.filter(c => c.id !== categoryId));
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error in deleteCategory:", error);
      toast.error("Failed to delete category");
    }
  };

  // Reservation operations
  const reserveProduct = async (productId: string, customerName: string, customerPhone: string) => {
    if (!validateEntityId(productId, "product")) {
      toast.error("Invalid product ID format");
      return;
    }

    const product = products.find(p => p.id === productId);
    
    if (!product) {
      toast.error("Product not found");
      return;
    }
    
    if (product.status !== 'available') {
      toast.error("Product is not available for reservation");
      return;
    }
    
    const newReservation: Reservation = {
      id: crypto.randomUUID(),
      productId,
      customerName,
      customerPhone,
      status: 'pending',
      reservationDate: new Date().toISOString()
    };
    
    try {
      logDataOperation("Creating", "reservation", newReservation.id);
      
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
      
      const { error: productError } = await supabase
        .from('products')
        .update({ status: 'reserved' })
        .eq('id', productId);
      
      if (productError) {
        console.error("Error updating product status in Supabase:", productError);
        toast.error("Failed to update product status in database");
        throw productError;
      }
      
      setReservations(current => [...current, newReservation]);
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
    if (!validateEntityId(reservationId, "reservation")) {
      toast.error("Invalid reservation ID format");
      return;
    }

    logDataOperation("Completing", "reservation", reservationId);
    const reservation = reservations.find(r => r.id === reservationId);
    
    if (!reservation) {
      console.error("Reservation not found:", reservationId);
      toast.error("Reservation not found");
      return;
    }
    
    try {
      const { error: reservationError } = await supabase
        .from('reservations')
        .update({ status: 'completed' })
        .eq('id', reservationId);
      
      if (reservationError) {
        console.error("Error completing reservation in Supabase:", reservationError);
        toast.error("Failed to complete reservation in database");
        throw reservationError;
      }
      
      const { error: productError } = await supabase
        .from('products')
        .update({ status: 'sold' })
        .eq('id', reservation.productId);
      
      if (productError) {
        console.error("Error updating product status in Supabase:", productError);
        toast.error("Failed to update product status in database");
        throw productError;
      }
      
      setReservations(current =>
        current.map(r => 
          r.id === reservationId ? { ...r, status: 'completed' as const } : r
        )
      );
      
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
    if (!validateEntityId(reservationId, "reservation")) {
      toast.error("Invalid reservation ID format");
      return;
    }

    logDataOperation("Cancelling", "reservation", reservationId);
    const reservation = reservations.find(r => r.id === reservationId);
    
    if (!reservation) {
      console.error("Reservation not found:", reservationId);
      toast.error("Reservation not found");
      return;
    }
    
    try {
      const { error: reservationError } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('id', reservationId);
      
      if (reservationError) {
        console.error("Error cancelling reservation in Supabase:", reservationError);
        toast.error("Failed to cancel reservation in database");
        throw reservationError;
      }
      
      const { error: productError } = await supabase
        .from('products')
        .update({ status: 'available' })
        .eq('id', reservation.productId);
      
      if (productError) {
        console.error("Error updating product status in Supabase:", productError);
        toast.error("Failed to update product status in database");
        throw productError;
      }
      
      setReservations(current =>
        current.map(r => 
          r.id === reservationId ? { ...r, status: 'cancelled' as const } : r
        )
      );
      
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
      const settingsData = {
        store_name: updatedSettings.storeName,
        logo_url: updatedSettings.logoUrl,
        slogan: updatedSettings.slogan,
        whatsapp_number: updatedSettings.whatsappNumber,
        exchange_rate: updatedSettings.exchangeRate
      };
      
      const { data: existingSettings, error: fetchError } = await supabase
        .from('settings')
        .select('id');
      
      if (fetchError) {
        console.error("Error fetching settings:", fetchError);
        throw fetchError;
      }
      
      if (existingSettings && existingSettings.length > 0) {
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
        const { error } = await supabase
          .from('settings')
          .insert(settingsData);
        
        if (error) {
          console.error("Error creating settings in Supabase:", error);
          toast.error("Failed to create settings in database");
          throw error;
        }
      }
      
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
        getReservationByProductId,
        refreshData
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
