
// Define the supported languages
export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'it';

// Define the structure of translation keys
export type TranslationKeys = {
  header: {
    storeDate: string;
    adminLogin: string;
  };
  product: {
    available: string;
    reserved: string;
    sold: string;
    reference: string;
    price: string;
    status: string;
    category: string;
    addToCart: string;
    viewDetails: string;
    notAvailable: string;
    reserveNow: string;
    yourName: string;
    yourPhone: string;
    cancel: string;
    confirm: string;
    nameRequired: string;
  };
  catalog: {
    searchProducts: string;
    searchPlaceholder: string;
    category: string;
    status: string;
    allCategories: string;
    allStatus: string;
    noProducts: string;
  };
  admin: {
    signOut: string;
    backToCatalog: string;
  };
};
